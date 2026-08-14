import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function colorFor(name: string): string {
  // simple deterministic hash → hue
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 70% 60%)`;
}

export function SpendBreakdown(props: { spendByTool: Array<{ tool: string; amount: number }> | null }) {
  const data =
    props.spendByTool?.map((x) => ({ name: x.tool, value: x.amount, color: colorFor(x.tool) })) ?? [];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData =
    data.length > 0
      ? data
      : [
          // placeholder slice so the donut circle is visible in empty state
          { name: "No spend", value: 1, color: "#334155" },
        ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Spend Breakdown</h2>

      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                  formatter={(value: number) => (data.length === 0 ? "" : `$${value.toFixed(2)}`)}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Stats */}
          <div className="flex flex-col justify-center space-y-4">
            {/* Total */}
            <div className="mb-4">
              <div className="text-sm text-slate-400 mb-1">Total Spend</div>
              <div className="text-3xl font-bold text-white">
                ${total.toFixed(2)}
              </div>
            </div>

            {/* Legend Items */}
            <div className="space-y-3">
              {data.length === 0 && (
                <div className="text-sm text-slate-400">
                  No spend recorded today. Once you run a task, spend by tool will appear here.
                </div>
              )}
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <div className="text-white font-semibold">
                    ${item.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}