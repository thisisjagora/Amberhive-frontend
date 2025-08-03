import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import LineMiniChart from "../charts/LineMiniChart";

const StatCard = ({ title, amount, changeText, changeType, data, strokeColor }) => {
  const isPositive = changeType === "positive";
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 text-base">{title}</p>
            {/* <Popover>
              <PopoverTrigger asChild>
                <MoreVertical className="h-4 w-4 text-gray-500 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-28 p-2 text-sm">
                <div className="space-y-1">
                  <p className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                    View Details
                  </p>
                </div>
              </PopoverContent>
            </Popover> */}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{amount}</div>
            <div className={`flex items-center text-sm ${changeColor}`}>
              {arrow} {changeText}
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <LineMiniChart data={data} strokeColor={strokeColor} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
