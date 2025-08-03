import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

const LineMiniChart = ({ data, strokeColor }) => {
  return (
    <div className="h-14 w-20">
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <XAxis dataKey="month" hide />
          <Tooltip contentStyle={{ fontSize: "14px" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            style={{
              filter: `drop-shadow(1px 1px 2px ${strokeColor}66)` 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineMiniChart;
