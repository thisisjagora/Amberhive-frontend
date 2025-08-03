import React from "react";
import { useParams, useNavigate } from "react-router";
import { authorKnowledgeVideos } from "@/data/knowledgeAuthorData";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shared/Layout";

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


  const video = authorKnowledgeVideos.find((v) => v.id === id);

  if (!video) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">Video not found</h2>
          <Button
            onClick={() => navigate("/dashboard/knowledge-base")}
            className="mt-12"
          >
            Back to Knowledge Base
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <div className="flex bg-white w-full flex-col px-4 mt-20 md:mt-10 py-6 space-y-2">
          {/* Back Button */}
          <Button
            variant="outline"
            className="w-fit cursor-pointer"
            onClick={() => navigate("/dashboard/knowledge-base")}
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
            "Sign up",
            "Get Started",
            "submit",
            "Sign in",
            "Next",
            "Save and Continue",
            "Submit for Review",
            "Create Ticket",
            "Email Campaign",
            "Add Subscriber",
            "upload",
            "subscribe",
            "subscriber",
            "subscribers",
            "membership",
            "Settings",
            "Save Changes",
            "Submit Ticket",
            "Promotions",
            "Imported Subscribers",
            "Yes"
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
    </Layout>
  );
};

export default KnowledgeDetail;
