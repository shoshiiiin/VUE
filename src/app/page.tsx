"use client"

import { WorkspaceProvider } from "@/components/workspace/workspace-context"
import { WorkspaceLayout } from "@/components/workspace/workspace-layout"
import { WidgetQuickShot } from "@/components/workspace/widget-quick-shot"
import { WidgetShotPack } from "@/components/workspace/widget-shot-pack"
import { WidgetQueue } from "@/components/workspace/widget-queue"
import { WidgetRecentAssets } from "@/components/workspace/widget-recent-assets"
import { WidgetModelControl } from "@/components/workspace/widget-model-control"
import { WidgetBrandLock } from "@/components/workspace/widget-brand-lock"
import { WidgetSmartLights } from "@/components/workspace/widget-smart-lights"
import { BottomContextBar } from "@/components/workspace/bottom-context-bar"

import { WidgetMagicWindow } from "@/components/workspace/widget-magic-window"
import { WidgetTimelineScrubber } from "@/components/workspace/widget-timeline-scrubber"
import { WidgetQuickPublish } from "@/components/workspace/widget-quick-publish"

export default function WorkspacePage() {
    return (
        <WorkspaceProvider>
            <WorkspaceLayout>
                <WidgetQuickShot />
                <WidgetShotPack />
                <WidgetModelControl />
                <WidgetMagicWindow />
                <WidgetBrandLock />
                <WidgetSmartLights />
                <WidgetRecentAssets />
                <WidgetQuickPublish />
                <WidgetQueue />
                <WidgetTimelineScrubber />
            </WorkspaceLayout>
            <BottomContextBar />
        </WorkspaceProvider>
    )
}
