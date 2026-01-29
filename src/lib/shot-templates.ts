export interface ShotTemplate {
    id: number;
    title: string;
    use: string;
    ratio_options: string[];
    variables: string[];
    prompt: string;
    negative_prompt: string;
    category: "Studio" | "Lifestyle" | "Macro" | "On-Face" | "Creative";
}

export const SHOT_TEMPLATES: ShotTemplate[] = [
    {
      "id": 1,
      "title": "PDP Hero – Front Packshot",
      "use": "Produktlisting + erste Galerie-Position",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}", "{material}", "{lens_type}"],
      "prompt": "Photorealistic studio product photo of {frame_model} eyeglasses, front view perfectly centered, temples slightly open symmetrically, clean white background, soft even diffused light, crisp edges, true-to-life materials {material}, lens type {lens_type} with subtle realistic reflections, e-commerce packshot, high resolution, sharp focus.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 2,
      "title": "PDP – 3/4 Angle (45°)",
      "use": "wichtigste zweite Ansicht",
      "ratio_options": ["1:1", "4:5"],
      "variables": ["{frame_model}"],
      "prompt": "Photorealistic studio packshot of {frame_model} glasses, 45-degree three-quarter angle, temples open, showing depth and hinge area, white seamless background, softbox lighting, premium product photography, tack sharp, realistic highlights.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 3,
      "title": "PDP – Side Profile",
      "use": "Bügel/Temple/Branding",
      "ratio_options": ["1:1", "3:2"],
      "variables": ["{frame_model}"],
      "prompt": "Studio product photo of {frame_model} glasses, strict side profile view, temples open, white seamless background, even diffused light, accurate geometry, realistic material texture, high detail, e-commerce style.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 4,
      "title": "Rear/Inside View (Bügel innen)",
      "use": "Verarbeitung, Gravuren innen",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Studio packshot of {frame_model} glasses, rear angle showing inside of temples and nose pads, white background, soft light, high detail, realistic engraving area visible, premium e-commerce photography.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 5,
      "title": "Top-Down / Aerial (open)",
      "use": "Design/Shape, besonders Social/Website",
      "ratio_options": ["1:1", "4:5"],
      "variables": ["{frame_model}"],
      "prompt": "Top-down aerial studio photo of {frame_model} glasses, neatly placed, temples open, white seamless background, soft shadow directly beneath, minimal clean composition, high-end product photography.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Creative"
    },
    {
      "id": 6,
      "title": "Flatlay (geschlossen)",
      "use": "Social Feed, Editorial, clean aesthetic",
      "ratio_options": ["4:5", "1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Editorial flat lay photo of {frame_model} glasses folded closed, minimal styling, white or light neutral surface, soft window light look, gentle shadows, premium minimal aesthetic, high resolution.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Creative"
    },
    {
      "id": 7,
      "title": "Macro – Scharnier/Logo",
      "use": "Qualitätsbeweis",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Extreme close-up macro photo of {frame_model} hinge and logo area, ultra sharp, realistic metal/plastic texture, soft diffused studio light, minimal background, premium craftsmanship focus.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Macro"
    },
    {
      "id": 8,
      "title": "Macro – Nasenpads/Bridge",
      "use": "RX-Frames, Komfortargument",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Macro product photo focusing on bridge and nose pads of {frame_model}, crisp detail, realistic materials, soft studio light, white/neutral background, premium optics product photography.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Macro"
    },
    {
      "id": 9,
      "title": "Lens-Coating Close-Up (Mirror/Polarized)",
      "use": "Sonnenbrillen, Performance",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}", "{lens_coating}"],
      "prompt": "Close-up product photo of {frame_model} sunglasses lens, showcasing {lens_coating} coating with controlled realistic reflection, studio lighting, high contrast detail, premium commercial photography, no text.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Macro"
    },
    {
      "id": 10,
      "title": "Material-Texture Shot",
      "use": "Premium-Storytelling",
      "ratio_options": ["1:1"],
      "variables": ["{material}", "{frame_model}"],
      "prompt": "Macro texture photo of {material} frame surface of {frame_model}, highlighting grain/lamination, ultra detailed, soft raking light, minimal background, premium product texture photography.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Macro"
    },
    {
      "id": 11,
      "title": "Size/Measurement Overlay",
      "use": "reduziert Retouren; wie bei JINS/Sunski",
      "ratio_options": ["2:1", "16:9"],
      "variables": ["{frame_model}"],
      "prompt": "Clean technical product image of {frame_model} glasses front view, with subtle measurement overlay lines and numbers (lens width, bridge, temple length), minimal grey overlay, white background, crisp and modern, e-commerce size guide style.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 12,
      "title": "On-Face Studio – Front",
      "use": "Fit/Style, Conversion",
      "ratio_options": ["4:5", "1:1"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Photorealistic studio portrait of a {model_description} wearing {frame_model} glasses, straight-on headshot, neutral background, soft beauty lighting, true-to-life fit on face, sharp eyes, natural skin texture, fashion eyewear editorial.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "On-Face"
    },
    {
      "id": 13,
      "title": "On-Face Studio – 3/4",
      "use": "zeigt Bügel/Proportion",
      "ratio_options": ["4:5"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Studio portrait of {model_description} wearing {frame_model}, three-quarter angle headshot, soft diffused light, neutral background, premium eyewear campaign style, realistic fit, high detail.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "On-Face"
    },
    {
      "id": 14,
      "title": "Lifestyle In Use – Outdoor",
      "use": "Website, Ads, Social",
      "ratio_options": ["16:9", "4:5"],
      "variables": ["{model_description}", "{frame_model}", "{location_style}"],
      "prompt": "Lifestyle photo of {model_description} wearing {frame_model} sunglasses outdoors in {location_style}, natural light, candid premium campaign look, shallow depth of field, authentic mood.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    },
    {
      "id": 15,
      "title": "Lifestyle Screen/Work",
      "use": "Blaulichtfilter-Brillen Content",
      "ratio_options": ["9:16", "4:5"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Lifestyle scene: {model_description} wearing {frame_model} blue-light glasses at a laptop in a cozy modern workspace, evening ambient light with soft practical lamps, subtle blue screen reflections on lenses, natural candid moment, high-end content.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    },
    {
      "id": 16,
      "title": "Colorway Lineup",
      "use": "Variantenübersicht, Social Carousel",
      "ratio_options": ["16:9", "1:1"],
      "variables": ["{frame_model}", "{n}"],
      "prompt": "Clean studio lineup of {frame_model} glasses in {n} colorways arranged evenly in a grid, white background, consistent lighting, minimal shadows, e-commerce catalog style, high resolution.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 17,
      "title": "Accessories Shot",
      "use": "Vertrauen + Wertigkeit",
      "ratio_options": ["1:1", "4:5"],
      "variables": ["{frame_model}"],
      "prompt": "Studio flat lay of {frame_model} glasses with included accessories (case, cleaning cloth), neatly arranged, white background, soft diffused light, premium unboxing feel, minimal composition.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Creative"
    },
    {
      "id": 18,
      "title": "UGC-Look Selfie",
      "use": "Social Proof Ads",
      "ratio_options": ["9:16"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Authentic UGC-style selfie video-still look: {model_description} wearing {frame_model}, handheld smartphone perspective, natural indoor light, slight imperfect framing but flattering, realistic skin texture, casual vibe, no brand text overlay.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    },
    {
      "id": 19,
      "title": "360° Turntable Keyframe",
      "use": "PDP Interaktiv/Animation",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Studio product photo of {frame_model} glasses on an invisible turntable look, perfectly centered, consistent lighting, white seamless background, designed for 360 spin sequence (clean edges, no changing shadows), high resolution.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 20,
      "title": "Website Hero Banner",
      "use": "Startseite, Kampagne, Paid Social Header",
      "ratio_options": ["16:9"],
      "variables": ["{frame_model}"],
      "prompt": "Wide hero banner image: {frame_model} glasses placed on minimal surface, premium soft light, lots of negative space on the left/right for text (copy space), clean modern brand aesthetic, high-end commercial product photography.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Creative"
    },
    {
      "id": 21,
      "title": "Studio Front View",
      "use": "Standard E-Commerce Front",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Pure frontal view - {frame_model} glasses facing directly forward, centered, with a subtle reflection below. No temples/arms visible from this angle. Clean white background, studio lighting.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections, visible temples",
      "category": "Studio"
    },
    {
      "id": 22,
      "title": "Studio 3/4 View",
      "use": "Standard E-Commerce Angle",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "{frame_model} glasses lying FLAT on surface, viewed from above-left at about 30 degrees. The frame faces slightly left, both temples/arms are FULLY EXTENDED and open, laying flat. The glasses rest on the surface with a subtle shadow underneath. Camera looks down at the glasses from a low angle. Clean studio lighting.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections, folded temples",
      "category": "Studio"
    },
     {
      "id": 23,
      "title": "Studio Folded Top View",
      "use": "Standard E-Commerce Folded",
      "ratio_options": ["1:1"],
      "variables": ["{frame_model}"],
      "prompt": "Front view from slightly above with FOLDED/CLOSED temples - the {frame_model} glasses are viewed from an elevated angle with both temple arms FOLDED INWARD (closed position, not open). The folded temples are visible underneath/behind the frame. This is a 'closed glasses' pose, NOT open temples.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections, open temples",
      "category": "Studio"
    },
    {
      "id": 24,
      "title": "Golden Hour Streets",
      "use": "Warm Lifestyle Ads",
      "ratio_options": ["4:5", "9:16"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Cinematic lifestyle portrait of {model_description} wearing {frame_model} glasses, walking down a city street during golden hour, warm backlit sun flare, lens flare, rim light on hair, shallow depth of field, bokeh, emotional and authentic brand campaign.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    },
    {
      "id": 25,
      "title": "Neon Nightlife",
      "use": "High-Energy / Gen-Z Marketing",
      "ratio_options": ["1:1", "9:16"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Flash photography night portrait of {model_description} wearing {frame_model} glasses, vibrant neon city lights in background (blue and pink), high contrast, glossy reflections on lenses, street fashion vibe, night out atmosphere.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Creative"
    },
    {
      "id": 26,
      "title": "Concrete Minimalist",
      "use": "Modern Architectural Aesthetic",
      "ratio_options": ["1:1", "4:5"],
      "variables": ["{frame_model}"],
      "prompt": "High-end product photo of {frame_model} glasses resting on a raw concrete block, sharp hard directional sunlight casting distinct shadows, architectural purity, brutalist composition, neutral colors, vogue italia style.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Studio"
    },
    {
      "id": 27,
      "title": "Cozy Coffee Shop",
      "use": "Relatable Daily Use",
      "ratio_options": ["4:5", "1:1"],
      "variables": ["{model_description}", "{frame_model}"],
      "prompt": "Candid lifestyle shot of {model_description} wearing {frame_model} glasses sitting at a wooden cafe table, soft window light, blurred coffee cup in foreground, reading a book or looking at laptop, intellectual and relaxed atmosphere.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    },
    {
      "id": 28,
      "title": "Summer Poolside",
      "use": "Seasonal/Sunglasses Campaign",
      "ratio_options": ["1:1", "4:5"],
      "variables": ["{frame_model}"],
      "prompt": "Bright summer product photo of {frame_model} sunglasses placed on the edge of a swimming pool, sparkling blue water background, bright high-key sunlight, hard caustics shadows, fresh summer vibe, luxury resort aesthetic.",
      "negative_prompt": "no text, no watermark, no extra logos, no distortions, no crooked frame geometry, no melted plastic, no deformed temples, no unrealistic reflections",
      "category": "Lifestyle"
    }
];

export const processTemplatePrompt = (template: ShotTemplate, frameModelName: string = "the product") => {
    let prompt = template.prompt;
    
    // Replace all placeholders with defaults for now
    // In a real app, these would come from user inputs or analysis
    prompt = prompt.replace(/{frame_model}/g, frameModelName);
    prompt = prompt.replace(/{material}/g, "high-quality acetate");
    prompt = prompt.replace(/{lens_type}/g, "clear demonstration lenses");
    prompt = prompt.replace(/{lens_coating}/g, "anti-reflective");
    prompt = prompt.replace(/{model_description}/g, "a professional fashion model");
    prompt = prompt.replace(/{location_style}/g, "a modern city street");
    prompt = prompt.replace(/{n}/g, "3");
    
    return prompt;
}
