import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Dynamically import ChartComponent with no SSR
const ChartComponent = dynamic(
  () => import("@/components/dashboard/chartComponent"),
  {
    ssr: false,
  }
);

export function Overview({ data }) {
  const [activeChart, setActiveChart] = useState("skin");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartConfig = {
    skin: {
      label: "Skin",
      color: "hsl(var(--chart-1))",
    },
    vbucks: {
      label: "VBucks",
      color: "hsl(var(--chart-2))",
    },
    extra: {
      label: "Extra",
      color: "hsl(var(--chart-3))",
    },
  };

  useEffect(() => {
    const transformOrdersData = (orders) => {
      // Crear un objeto para almacenar los totales por fecha
      const totalsByDate = {};

      orders.forEach((order) => {
        // Obtener la fecha de la orden
        const date = new Date(order.timestamp).toISOString().split("T")[0];

        // Inicializar el objeto para la fecha si no existe
        if (!totalsByDate[date]) {
          totalsByDate[date] = { skin: 0, vbucks: 0, extra: 0 };
        }

        // Iterar sobre los ítems de la orden
        order.items.forEach((item) => {
          // Convertir el precio a número
          const price = parseFloat(item.price);

          // Actualizar el total por categoría
          if (item.category === "skin") {
            totalsByDate[date].skin += price * item.quantity;
          } else if (item.category === "vbucks") {
            totalsByDate[date].vbucks += price * item.quantity;
          } else {
            totalsByDate[date].extra += price * item.quantity;
          }
        });
      });

      // Convertir el objeto de totales a un array
      const chartData = Object.keys(totalsByDate).map((date) => ({
        date,
        skin: totalsByDate[date].skin,
        vbucks: totalsByDate[date].vbucks,
        extra: totalsByDate[date].extra,
      }));
      chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
      return chartData;
    };
    const transform = async () => {
      const chartData = await transformOrdersData(data);
      setOrders(chartData);
      setLoading(false);
    };
    transform();
  }, [data]);

  const total = useMemo(
    () => ({
      skin: orders.reduce((acc, curr) => acc + curr.skin, 0),
      vbucks: orders.reduce((acc, curr) => acc + curr.vbucks, 0),
      extra: orders.reduce((acc, curr) => acc + curr.extra, 0),
    }),
    [orders]
  );

  return (
    <Card className="col-span-4 bg-black">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Showing total earnings for last months.
          </CardDescription>
        </div>
        <div className="flex">
          {["skin", "vbucks", "extra"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-2"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-xl font-bold leading-none xl:text-3xl">
                  ${total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 h-[350px] sm:p-6">
        <ChartComponent
          data={orders}
          activeChart={activeChart}
          chartConfig={chartConfig}
        />
      </CardContent>
    </Card>
  );
}
