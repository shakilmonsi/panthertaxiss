import React from "react";

export const PdfDownload = ({ filteredReports, selected }) => {
  const handleExport = () => {
    if (!filteredReports || filteredReports.length === 0) {
      alert("No data to export.");
      return;
    }

    const header = ["Date", "Status", "Details", "User", "Email", "Link"];
    const rows = filteredReports.map((r) => [
      r.date,
      r.status,
      r.details,
      r.user,
      r.email,
      r.link,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reports-${selected.replace(/\s+/g, "_").toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Export CSV
    </button>
  );
};

export const CsvDownload = () => {
  return <div>PdfOrCsv</div>;
};
