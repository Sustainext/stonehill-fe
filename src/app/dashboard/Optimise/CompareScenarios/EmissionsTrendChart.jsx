// Updated EmissionsTrendChart.jsx with improved tooltip and spacing
import React from "react";
import { ResponsiveLine } from '@nivo/line';

const EmissionsTrendChart = ({ data, selectedScope }) => {
  const CustomTooltip = ({ point }) => {
    if (!point) return null;
    
    // Get the year (x value) from the hovered point
    const year = point.data.x;
    
    // Find all points from all series that match this year
    const allSeriesPoints = data.map(series => {
      const matchingPoint = series.data.find(d => d.x === year);
      return {
        id: series.id,
        color: series.color,
        value: matchingPoint ? matchingPoint.y : null,
        dashed: series.dashed
      };
    }).filter(p => p.value !== null);
    
    return (
      <div className="bg-gray-100 p-2 shadow-lg border border-gray-200 rounded-md text-xs">
        <div className="font-medium text-gray-800 mb-2">Year: {year}</div>
        {allSeriesPoints.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                backgroundColor: p.color,
                border: p.dashed ? '1px dashed currentColor' : 'none'
              }} 
            />
            <span className="text-sm">{p.id}: </span>
            <span className="text-sm font-medium">{Math.round(p.value).toLocaleString()} tCO₂e</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-12 w-full">
      {/* Increased height to accommodate the legend at the top */}
      <div className="bg-white p-4 rounded-lg border border-gray-100 w-full" style={{ height: 460 }}>
        <ResponsiveLine
          data={data}
          // Increased top margin to make room for legend
          margin={{ top: 80, right: 60, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ 
            type: 'linear', 
            min: 'auto',
            max: 'auto',
            stacked: false, 
            reverse: false 
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Projection Timeline',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Emissions (in tCO₂e)',
            legendOffset: -55,
            legendPosition: 'middle',
            format: value => `${value}`
          }}
          enableGridX={false}
          colors={(d) => d.color || '#3182CE'} // Use the color from the data
          lineWidth={2}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          tooltip={CustomTooltip}
          crosshairType="x"
          enableSlices="x"
          legends={[
            {
              anchor: 'top',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -40, // Position closer to chart
              itemsSpacing: 20, // Increased spacing between items
              itemDirection: 'left-to-right',
              itemWidth: 180, // Increased width for labels
              itemsSpacing: 20,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              truncate: true,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default EmissionsTrendChart;