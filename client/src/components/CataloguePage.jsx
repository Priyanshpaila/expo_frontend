import React from "react";
import { Download, FileText } from "lucide-react";

// 🔧 Put your real GDrive links + cover image URLs here
const BROCHURES = [
    {
        id: 1,
        title: "Hira Company Brochure",
        subtitle: "HIRA Product Brochure",
        driveUrl: "https://drive.google.com/file/d/1ohizn_zm0zRumz_ZrmseP3F0S3LNDEb3/view?usp=drive_link", // PDF link
        coverPath: "/brochures/Company.png",
        fileType: "PDF",
        fileSize: "44.5 MB",
    },
    {
        id: 2,
        title: "HIRA Solar Brochure",
        subtitle: "Solar Mounting & Structures",
        driveUrl: "https://drive.google.com/file/d/1OLC3zz_tzthbrMPdfG4eiWlILAFqaeoC/view?usp=drive_link",
        coverPath: "/brochures/Solar.png",
        fileType: "PDF",
        fileSize: "31.5 MB",
    },
    {
        id: 3,
        title: "HIRA Poles Brochure",
        subtitle: "Lighting & Pole Solutions",
        driveUrl: "https://drive.google.com/file/d/14T6upVKamDxjfIoliIKqiHXOXvkv-ARt/view?usp=drive_link",
        coverPath: "/brochures/Poles.png",
        fileType: "PDF",
        fileSize: "16.5 MB",
    },
    {
        id: 4,
        title: "HIRA Crash Barrier Brochure",
        subtitle: "Highway Saftey Crash Barrier",
        driveUrl: "https://drive.google.com/file/d/10UVEjns0LysUNonpQ3pmlFlRfEAlHDBZ/view?usp=drive_link",
        coverPath: "/brochures/Crash.png",
        fileType: "PDF",
        fileSize: "13.8 MB",
    },
    {
        id: 5,
        title: "HIRA Pipes Brochure",
        subtitle: "Long Products & Sections",
        driveUrl: "https://drive.google.com/file/d/15R5NxGAm_HDdLxcppVAzr72p7TT2a-i7/view?usp=drive_link",
        coverPath: "/brochures/Pipes.png",
        fileType: "PDF",
        fileSize: "22.5 MB",
    },
    {
        id: 6,
        title: "HIRA STRUCTURE Brochure",
        subtitle: "Railway & TLT Structures",
        driveUrl: "https://drive.google.com/file/d/1PpfNhuwO0P0QzewpHx09GQGX_hijzw-L/view?usp=drive_link",
        coverPath: "/brochures/Structures.png",
        fileType: "PDF",
        fileSize: "17.7 MB",
    },
];

export default function CataloguePage() {
    return (
        <div className="bg-white rounded-xl border shadow-card">
            <div className="px-6 py-5 border-b flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Brochure Gallery
                    </h2>
                    <p className="text-sm text-slate-500">
                        Click on any brochure to open or download the full PDF.
                    </p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {BROCHURES.map((item) => (
                        <a
                            key={item.id}
                            href={item.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-shadow"
                        >
                            {/* Cover image */}
                            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                                {item.coverPath ? (
                                    <img
                                        src={item.coverPath}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                                        <FileText className="h-8 w-8" />
                                        <span className="text-xs">No preview image</span>
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-100">
                                                {item.fileType || "PDF"}
                                                {item.fileSize ? ` • ${item.fileSize}` : ""}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/90 px-2.5 py-1 text-[11px] font-medium text-white">
                                            <Download className="h-3 w-3" />
                                            View / Download
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Text below image */}
                            <div className="px-3 py-3">
                                <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                                    {item.title}
                                </p>
                                {item.subtitle && (
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
