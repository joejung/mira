import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Cpu } from "lucide-react";

interface ChipsetSelectorProps {
    vendor: "QUALCOMM" | "MEDIATEK" | "EXYNOS";
    onVendorChange: (vendor: "QUALCOMM" | "MEDIATEK" | "EXYNOS") => void;
    version: string;
    onVersionChange: (version: string) => void;
    revision: string;
    onRevisionChange: (revision: string) => void;
}

const CHIPSET_DATA = {
    QUALCOMM: {
        label: "Qualcomm",
        series: ["Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2", "Snapdragon 7+ Gen 3"],
    },
    MEDIATEK: {
        label: "MediaTek",
        series: ["Dimensity 9300", "Dimensity 8300", "Dimensity 7200"],
    },
    EXYNOS: {
        label: "Exynos",
        series: ["Exynos 2400", "Exynos 2200", "Exynos 1480"],
    }
};

export default function ChipsetSelector({
    vendor,
    onVendorChange,
    version,
    onVersionChange,
    revision,
    onRevisionChange
}: ChipsetSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Vendor</Label>
                    <Select value={vendor} onValueChange={(val: any) => onVendorChange(val)}>
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select Vendor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="QUALCOMM">Qualcomm</SelectItem>
                            <SelectItem value="MEDIATEK">MediaTek</SelectItem>
                            <SelectItem value="EXYNOS">Exynos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Series / Model</Label>
                    <Select value={version} onValueChange={onVersionChange}>
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {CHIPSET_DATA[vendor].series.map((model) => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                    <Cpu size={14} className="text-indigo-500" />
                    Hardware Revision / SVN
                </Label>
                <Input
                    placeholder={vendor === "QUALCOMM" ? "e.g. Rev 1.1 or SVN-23" : "e.g. MP-1.0"}
                    value={revision}
                    onChange={(e) => onRevisionChange(e.target.value)}
                    className="h-10"
                />
            </div>
        </div>
    );
}
