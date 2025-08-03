import React from "react";
import { Link } from "react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { knowledgeVideos } from "@/data/knowledgeSuperData";
import SuperAdminLayout from "./DashboardLayout";

const KnowledgeBase = () => {
  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6">
          <h1 className="text-xl font-bold">Knowledge Base</h1>
          <p className="text-gray-500 text-sm">Click a topic to learn more</p>
        </div>
      }
    >
      <div className="grid gap-6 px-4 py-6 mt-6 sm:grid-cols-2">
        {knowledgeVideos.map((video) => (
          <Link to={`/super-admin/knowledge/${video.id}`} key={video.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-yellow-700">
                  {video.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </SuperAdminLayout>
  );
};

export default KnowledgeBase;
