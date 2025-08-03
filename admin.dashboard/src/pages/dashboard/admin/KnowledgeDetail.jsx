import React from "react";
import { useParams, useNavigate } from "react-router";
import AdminLayout from "./DashboardLayout";
import { knowledgeVideos } from "@/data/knowledgeData";
import { Button } from "@/components/ui/button";

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
      <AdminLayout>
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">Video not found</h2>
          <Button onClick={() => navigate("/admin/knowledge")} className="mt-4">
            Back to Knowledge Base
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 space-y-2">
          {/* Back Button */}
          <Button
            variant="outline"
            className="w-fit cursor-pointer"
            onClick={() => navigate("/admin/knowledge-base")}
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
            "navigate",
            "Pending Approval",
            "Approve",
            "Reject",
            "Create Genre",
            "Submit",
            "view details",
            "read book",
            "success message",
            "content management",
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
    </AdminLayout>
  );
};

export default KnowledgeDetail;
