// components/admin/AdminStatusChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LegendItemProps {
  color: string;
  label: string;
  count: number;
  percent: number;
}

function LegendItem({ color, label, count, percent }: LegendItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className="block w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-theme-sm text-gray-600 dark:text-gray-300">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
          {count}
        </span>
        <span className="text-theme-xs text-gray-400 dark:text-gray-500 w-10 text-right">
          {percent}%
        </span>
      </div>
    </div>
  );
}

export default function AdminStatusChart() {
  const total = 1250;
  const data = [
    { label: "Completed", count: 830, color: "#22C55E" },
    { label: "On-Going", count: 300, color: "#F59E0B" },
    { label: "Pending", count: 120, color: "#EF4444" },
  ];

  const series = data.map((d) => d.count);
  const colors = data.map((d) => d.color);
  const labels = data.map((d) => d.label);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 220,
      toolbar: { show: false },
    },
    colors,
    labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontWeight: 500,
              color: "#9CA3AF",
              formatter: () => `${total.toLocaleString()}`,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              offsetY: 4,
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} documents` },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Status Breakdown
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          System-wide document status distribution
        </p>
      </div>

      <div className="flex items-center justify-center">
        <Chart
          options={options}
          series={series}
          type="donut"
          height={220}
          width="100%"
        />
      </div>

      <div className="mt-5 space-y-3 border-t border-gray-100 dark:border-white/[0.05] pt-5">
        {data.map((d) => (
          <LegendItem
            key={d.label}
            color={d.color}
            label={d.label}
            count={d.count}
            percent={Math.round((d.count / total) * 100)}
          />
        ))}
      </div>
    </div>
  );
}
