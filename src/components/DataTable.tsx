import React from 'react';
import Papa from 'papaparse';

const DataTable = ({ data }: { data: string }) => {
  const dummy = Papa.parse(data, { header: true });
  const parsedData = dummy.data;

  console.log(parsedData);

  const headers = Object.keys(parsedData[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parsedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
