import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      styleImage, // Now optional
      objectImages,
      modelId,
      angleDescription,
      angleName,
      textPrompt, // NEW: Full text prompt if no style image is used
      editImage, // NEW: For editing
      aspectRatio = "1:1" // NEW: Default to square
    } = body;

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server not configured: Missing API Key" },
        { status: 500 },
      );
    }

    const productImages = Array.isArray(objectImages) ? objectImages : [];
    const genAI = new GoogleGenerativeAI(apiKey);
    const cleanBase64 = (str: string) => str.split(",")[1] || str;

    const objectParts = productImages.map((img: string) => ({
      inlineData: {
        data: cleanBase64(img),
        mimeType: "image/jpeg",
      },
    }));

    // --- CASE 1: STYLE REFERENCE MODE (Existing Logic) ---
    if (styleImage) {
        const stylePart = {
          inlineData: {
            data: cleanBase64(styleImage),
            mimeType: "image/jpeg",
          },
        };

        const combinedPrompt = `
        You are an expert product photographer specializing in high-fidelity e-commerce imagery.

        ## GOAL
        Create a new product image by placing the **PRODUCT** into the **STYLE/POSE** of the reference.

        ## INPUTS
        1. **STYLE REFERENCE (First Image)**: Defines the CAMERA ANGLE, Perspective, Lighting, and Shadow.
        2. **PRODUCT REFERENCE (Following Images)**: Defines the OBJECT (Glasses). This is the "Ground Truth" for the product details.

        ## CRITICAL: CAMERA ANGLE LOCK
        - **IGNORE** the perspective of the Product Reference images.
        - **LOCK** your camera to the **EXACT** angle and perspective of the **STYLE REFERENCE**.
        - If the Style Reference is "Angled View 1" (flat on surface), you MUST generate that exact flat lay angle.

        ## CRITICAL: PRODUCT FIDELITY RULES
        - **GEOMETRY LOCK**: The glasses in the output MUST be a 100% COPY of the **PRODUCT REFERENCE** geometry.
        - **STRUCTURAL OVERRIDE**: 
            - If the **PRODUCT** has separate metal nose pads, you **MUST RENDER THEM**, even if the **STYLE REFERENCE** does not.
            - **DO NOT** structural blend. **DO NOT** delete nose pads.
            - The bridge and nose pads must be **IDENTICAL** to the Product Reference.

        ## TARGET COMPOSITION
        - **Angle**: ${angleName}
        - **Description**: ${angleDescription}
        - **Background**: Pure light gray (hex #F2F2F2)
        - **Atmosphere**: Professional studio lighting matching the Style Reference.

        ## EXECUTION
        - **STEP 1 (OBJECT)**: Extract the glasses from the Product Reference.
        - **STEP 2 (POSE)**: Rotate this object to match the ${angleName} of the Style Reference.
        - **STEP 3 (LIGHT)**: Apply lighting from Style Reference.
        - **OUTPUT**: Photorealistic, 1:1 Product Match, Aspect Ratio: ${aspectRatio}.
        `;

        const model = genAI.getGenerativeModel({
          model: modelId,
        });

        const result = await model.generateContent([
          combinedPrompt,
          stylePart,
          ...objectParts,
        ]);

        return processResponse(result, angleName);
    } 
    
    // --- CASE 3: EDIT MODE (New Logic) ---
    else if (editImage) {
        const mutationPrompt = textPrompt;

        const editPart = {
          inlineData: {
            data: cleanBase64(editImage),
            mimeType: "image/jpeg",
          },
        };

        const combinedPrompt = `
        You are an expert retoucher and AI image editor.
        
        ## GOAL
        Edit the provided input image according to the user's instructions.
        
        ## INPUT
        1. **IMAGE**: The user has provided an image to modify.
        2. **INSTRUCTIONS**: "${mutationPrompt}"
        
        ## RULES
        - **SUBJECT CONSTANCY**: Keep the main subject (the product) UNCHANGED unless the prompt explicitly asks to modify it.
        - **STYLE**: Maintain the same photorealistic style, lighting, and camera angle unless asked to change.
        - **EXECUTION**: Apply the requested changes (e.g., "Change background to blue", "Remove reflection", "Add shadow") precisely.
        
        Generate the modified image now.
        `;

        const model = genAI.getGenerativeModel({
            model: modelId,
        });

        const result = await model.generateContent([
            combinedPrompt,
            editPart,
        ]);

        return processResponse(result, "Edited Version");
    }

    // --- CASE 2: TEXT PROMPT MODE (Fallback) ---
    else {
        // Fallback if no specific text prompt provided
        const finalPrompt = textPrompt || `
            Professional product photography of these glasses. 
            View: ${angleName}. 
            Description: ${angleDescription}.
            Background: Clean white or light grey studio background.
        `;

        const combinedPrompt = `
        You are an expert product photographer.

        ## GOAL
        Generate a photorealistic image of the **PRODUCT** described by the text prompt.

        ## INPUT
        1. **PRODUCT REFERENCE (Images)**: These define the exact glasses to be shown.
        2. **SCENE DESCRIPTION**: "${finalPrompt}"

        ## RULES
        - **PRODUCT FIDELITY**: The glasses MUST look exactly like the Product Reference images (same shape, color, materials, details, nose pads).
        - **SCENE**: Strictly follow the SCENE DESCRIPTION for the angle, lighting, and background.
        - **SCENE**: Strictly follow the SCENE DESCRIPTION for the angle, lighting, and background.
        - **QUALITY**: High resolution, sharp focus, commercial standard. Aspect Ratio: ${aspectRatio}.

        Generate the image now.
        `;

        const model = genAI.getGenerativeModel({
            model: modelId,
        });

        // Only send product parts, no style part
        const result = await model.generateContent([
            combinedPrompt,
            ...objectParts,
        ]);

        return processResponse(result, angleName);
    }

  } catch (error: any) {
    console.error("Error in generate:", error);
    let errorMessage = error.message || "Something went wrong";
    if (errorMessage.includes("fetch failed")) errorMessage = "Network error connecting to Google API.";
    else if (errorMessage.includes("404")) errorMessage = "Model not found. Try switching to 'Nano Banana'.";
    else if (errorMessage.includes("429")) errorMessage = "Rate limit exceeded. Please wait.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Helper to standardise response handling
async function processResponse(result: any, angleName: string) {
    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (imagePart?.inlineData?.data) {
      return NextResponse.json({
        image: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        angle: angleName,
      });
    }

    const textContent = response.text?.() || "No response text";
    return NextResponse.json(
      {
        error: `No image was generated for ${angleName}. Model response: ${textContent.substring(0, 300)}`,
      },
      { status: 400 },
    );
}
