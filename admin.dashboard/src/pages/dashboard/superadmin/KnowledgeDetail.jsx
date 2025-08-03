import React from "react";
import { useParams, useNavigate } from "react-router";
import { knowledgeVideos } from "@/data/knowledgeSuperData";
import { Button } from "@/components/ui/button";
import SuperAdminLayout from "./DashboardLayout";

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const highlightKeywords = (text, keywords = []) => {
    // Escape special characters in keywords and sort by length (longest first)
    const escapedKeywords = keywords
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const pattern = new RegExp(`(${escapedKeywords.join("|")})`, "gi");

    return text.split(pattern).map((part, i) =>
      keywords.some((k) => k.toLowerCase() === part.trim().toLowerCase()) ? (
        <strong key={i} className="text-yellow-700 font-semibold">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const video = knowledgeVideos.find((v) => v.id === id);

  if (!video) {
    return (
      <SuperAdminLayout>
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">Video not found</h2>
          <Button
            onClick={() => navigate("/super-admin/knowledge")}
            className="mt-4"
          >
            Back to Knowledge Base
          </Button>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 space-y-2">
          {/* Back Button */}
          <Button
            variant="outline"
            className="w-fit cursor-pointer"
            onClick={() => navigate("/super-admin/knowledge-base")}
          >
            ← Back
          </Button>

          {/* Title */}
          <h1 className="text-xl font-bold">{video.title}</h1>
        </div>
      }
    >
      <div className="px-4 py-6 mt-6 space-y-6">
        {/* Script */}
        <div className="bg-gray-50 p-4 max-w-3xl text-justify border rounded-md text-sm whitespace-pre-wrap leading-relaxed">
          {highlightKeywords(video.script, [
            "log in",
            "navigate",
            "Admin Management",
            "Add Admin",
            "submit",
            "Reports section",
            "expand icon",
            "Download Report",
            "Author report",
          ])}
        </div>

        {/* Video */}

        <div className="aspect-video border-2 border-gray-200 rounded-lg overflow-hidden">
          <video
            src={video.src}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default KnowledgeDetail;
