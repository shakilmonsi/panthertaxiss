import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { getData } from "../../../../utils/axiosInstance";

// PDF generation libraries - FIXED IMPORTS
import jsPDF from "jspdf";

// Import autoTable function directly
import autoTable from "jspdf-autotable";

// Add autoTable to jsPDF prototype
jsPDF.autoTable = autoTable;

// -------------------- Date Formatting Utility --------------------
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format to: DD/MM/YYYY (e.g., 10/07/2025)
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// -------------------- Helper function for PDF date formatting --------------------
const formatDateForPDF = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format to: DD/MM/YYYY for PDF
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// --- 1. Hook to fetch the base checklist structure ---
const useChecklistItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      console.log(
        "-> Attempting to fetch base checklist items (checklist-items)...",
      );

      try {
        const response = await getData("checklist-items");
        let fetchedChecklist = [];
        const apiData = response?.data;

        if (Array.isArray(response)) {
          fetchedChecklist = response;
        } else if (Array.isArray(apiData?.checklistItems)) {
          fetchedChecklist = apiData.checklistItems;
        } else if (Array.isArray(apiData)) {
          fetchedChecklist = apiData;
        } else if (Array.isArray(response?.checklistItems)) {
          fetchedChecklist = response.checklistItems;
        }

        setItems(fetchedChecklist);
        console.log(
          "✅ Checklist items fetched successfully. Total items:",
          fetchedChecklist.length,
        );

        if (fetchedChecklist.length === 0) {
          console.warn(
            "⚠️ Checklist items array is empty. Check the 'checklist-items' API response structure.",
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to fetch base checklist items for modal:",
          error,
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
};

// --- 2. PDF Generation Functions ---

// Function to generate PDF for a single report
const generateSingleReportPDF = (report, baseChecklistItems = []) => {
  try {
    const doc = new jsPDF();

    // Extract data
    const submittedItems = report.completedForm?.inspectionTable || [];
    const headerInfo = report.completedForm?.headerInfo || {};
    const driverName =
      report.driverName ||
      report.completedForm?.driverName ||
      headerInfo.driverName ||
      report.submissionDetails?.submittedBy?.name ||
      "N/A";
    const notes =
      report.completedForm?.notes ||
      report.submissionDetails?.notes ||
      report.notes ||
      "No notes provided.";
    const submittedAt = report.submissionDetails?.submittedAt || report.date;

    // Use formatted dates for PDF
    const date = submittedAt
      ? formatDateForPDF(submittedAt)
      : headerInfo.date || "N/A";
    const time = submittedAt
      ? new Date(submittedAt).toLocaleTimeString()
      : headerInfo.time || "N/A";

    // Modern Header Design with Blue Accent
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("DAILY CHECK REPORT", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${formatDateForPDF(new Date().toISOString())}`,
      105,
      25,
      {
        align: "center",
      },
    );

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Information Section with Modern Card Design
    let yPos = 45;

    // Driver Info Card
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.roundedRect(14, yPos, 182, 35, 2, 2, "F");
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.roundedRect(14, yPos, 182, 35, 2, 2, "S");

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("SUBMITTED BY", 20, yPos);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPos += 7;
    doc.text(`Driver Name: ${driverName}`, 20, yPos);
    yPos += 6;
    doc.text(
      `Badge No: ${headerInfo.driverBadgeNo || report.badgeNo || "N/A"}`,
      20,
      yPos,
    );

    yPos += 6;
    doc.text(`Date: ${date}`, 20, yPos);
    doc.text(`Time: ${time}`, 110, yPos);

    // Vehicle Info Card
    yPos += 15;
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.roundedRect(14, yPos, 182, 28, 2, 2, "F");
    doc.setDrawColor(191, 219, 254); // Blue-200
    doc.roundedRect(14, yPos, 182, 28, 2, 2, "S");

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("VEHICLE INFORMATION", 20, yPos);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPos += 7;
    doc.text(
      `Vehicle Reg No: ${headerInfo.vehicleRegNo || report.vehicleRegNo || "N/A"}`,
      20,
      yPos,
    );
    doc.text(
      `Plate No: ${headerInfo.plateNo || report.plateNo || "N/A"}`,
      110,
      yPos,
    );
    yPos += 6;
    doc.text(
      `Mileage: ${headerInfo.mileage || report.mileage || "N/A"}`,
      20,
      yPos,
    );

    // Checklist Section
    yPos += 15;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.text("INSPECTION CHECKLIST", 14, yPos);
    yPos += 2;

    // Underline
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(14, yPos, 60, yPos);

    yPos += 5;

    if (submittedItems.length > 0) {
      const tableData = submittedItems.map((item) => {
        const reqText = Array.isArray(item.requirement)
          ? item.requirement.join("\n")
          : item.requirement || "";
        const cleanStatus = (item.status || "").trim().toUpperCase();

        // Professional checkboxes with icons
        const faulty = cleanStatus === "FAULTY" ? "✗" : "";
        const correct = cleanStatus === "CORRECT" ? "✓" : "";

        return [item.area || "", reqText, faulty, correct];
      });

      // FIXED: Using autoTable directly
      autoTable(doc, {
        startY: yPos,
        head: [["Area", "Requirement", "FAULTY", "CORRECT"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [37, 99, 235], // Blue-600
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [229, 231, 235], // Gray-200
          lineWidth: 0.1,
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: {
            cellWidth: 45,
            fontStyle: "bold",
            textColor: [55, 65, 81],
            halign: "left",
          }, // Gray-700
          1: {
            cellWidth: 95,
            halign: "left",
          },
          2: {
            cellWidth: 23,
            halign: "center",
            fontStyle: "bold",
            textColor: [220, 38, 38], // Red-600
          },
          3: {
            cellWidth: 23,
            halign: "center",
            fontStyle: "bold",
            textColor: [22, 163, 74], // Green-600
          },
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Gray-50
        },
        margin: { left: 14, right: 14 },
        didDrawCell: (data) => {
          // Add professional checkboxes with circles
          if (data.column.index === 2 || data.column.index === 3) {
            const text = data.cell.raw;
            if (text === "✓" || text === "✗") {
              const x = data.cell.x + data.cell.width / 2;
              const y = data.cell.y + data.cell.height / 2;

              // Draw circle
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.3);
              doc.circle(x, y, 4, "S");

              // Set text color based on status
              if (text === "✓") {
                doc.setTextColor(22, 163, 74); // Green
              } else {
                doc.setTextColor(220, 38, 38); // Red
              }

              // Draw check/cross mark
              doc.setFontSize(8);
              doc.text(text, x, y + 1.5, {
                align: "center",
                baseline: "middle",
              });

              // Reset text color
              doc.setTextColor(0, 0, 0);
            }
          }
        },
      });
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(107, 114, 128); // Gray-500
      doc.text("No checklist items found.", 14, yPos);
    }

    // Notes Section with Card Design
    const finalY = doc.lastAutoTable?.finalY || yPos + 10;

    if (finalY < 250) {
      doc.setFillColor(254, 252, 232); // Yellow-50
      doc.roundedRect(14, finalY + 8, 182, 0, 2, 2, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("ADDITIONAL NOTES", 14, finalY + 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const splitNotes = doc.splitTextToSize(notes, 175);
      doc.text(splitNotes, 18, finalY + 23);

      // Draw border around notes
      const notesHeight = splitNotes.length * 5 + 18;
      doc.setDrawColor(250, 204, 21); // Yellow-400
      doc.setLineWidth(0.5);
      doc.roundedRect(14, finalY + 8, 182, notesHeight, 2, 2, "S");
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("This is an auto-generated report", 105, pageHeight - 10, {
      align: "center",
    });

    // Save PDF
    const fileName = `Daily_Check_${report.vehicleRegNo || "Report"}_${date.replace(/\//g, "-")}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Function to generate PDF for all reports
const generateAllReportsPDF = (historyData, baseChecklistItems = []) => {
  try {
    const doc = new jsPDF();
    let isFirstPage = true;

    historyData.forEach((report, reportIndex) => {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;

      // Extract data
      const submittedItems = report.completedForm?.inspectionTable || [];
      const headerInfo = report.completedForm?.headerInfo || {};
      const driverName =
        report.driverName ||
        report.completedForm?.driverName ||
        headerInfo.driverName ||
        report.submissionDetails?.submittedBy?.name ||
        "N/A";
      const notes =
        report.completedForm?.notes ||
        report.submissionDetails?.notes ||
        report.notes ||
        "No notes provided.";
      const submittedAt = report.submissionDetails?.submittedAt || report.date;

      // Use formatted dates for PDF
      const date = submittedAt
        ? formatDateForPDF(submittedAt)
        : headerInfo.date || "N/A";
      const time = submittedAt
        ? new Date(submittedAt).toLocaleTimeString()
        : headerInfo.time || "N/A";

      // Modern Header Design
      doc.setFillColor(37, 99, 235); // Blue-600
      doc.rect(0, 0, 210, 30, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`REPORT ${reportIndex + 1} - DAILY CHECK`, 105, 12, {
        align: "center",
      });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Vehicle: ${headerInfo.vehicleRegNo || report.vehicleRegNo || "N/A"} | Date: ${date}`,
        105,
        22,
        { align: "center" },
      );

      // Reset text color
      doc.setTextColor(0, 0, 0);

      let yPos = 38;

      // Compact Info Section
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(14, yPos, 182, 22, 2, 2, "F");
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(14, yPos, 182, 22, 2, 2, "S");

      yPos += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`Driver: ${driverName}`, 18, yPos);
      doc.text(
        `Badge: ${headerInfo.driverBadgeNo || report.badgeNo || "N/A"}`,
        110,
        yPos,
      );

      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.text(
        `Plate: ${headerInfo.plateNo || report.plateNo || "N/A"}`,
        18,
        yPos,
      );
      doc.text(
        `Mileage: ${headerInfo.mileage || report.mileage || "N/A"}`,
        110,
        yPos,
      );

      yPos += 5;
      doc.text(`Time: ${time}`, 18, yPos);

      // Checklist Section
      yPos += 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("INSPECTION CHECKLIST", 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 3;

      if (submittedItems.length > 0) {
        const tableData = submittedItems.map((item) => {
          const reqText = Array.isArray(item.requirement)
            ? item.requirement.join(" ")
            : item.requirement || "";
          const cleanStatus = (item.status || "").trim().toUpperCase();

          // Professional checkboxes with icons
          const faulty = cleanStatus === "FAULTY" ? "✗" : "";
          const correct = cleanStatus === "CORRECT" ? "✓" : "";

          return [item.area || "", reqText, faulty, correct];
        });

        // FIXED: Using autoTable directly
        autoTable(doc, {
          startY: yPos,
          head: [["Area", "Requirement", "FAULTY", "CORRECT"]],
          body: tableData,
          theme: "striped",
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 8,
            halign: "center",
          },
          styles: {
            fontSize: 7,
            cellPadding: 2.5,
            lineColor: [229, 231, 235],
            lineWidth: 0.1,
            halign: "center",
            valign: "middle",
          },
          columnStyles: {
            0: {
              cellWidth: 38,
              fontStyle: "bold",
              textColor: [55, 65, 81],
              halign: "left",
            },
            1: {
              cellWidth: 105,
              halign: "left",
            },
            2: {
              cellWidth: 19,
              halign: "center",
              fontStyle: "bold",
              textColor: [220, 38, 38],
            },
            3: {
              cellWidth: 19,
              halign: "center",
              fontStyle: "bold",
              textColor: [22, 163, 74],
            },
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251],
          },
          margin: { left: 14, right: 14, bottom: 25 },
          didDrawCell: (data) => {
            // Add professional checkboxes with circles for all reports PDF
            if (data.column.index === 2 || data.column.index === 3) {
              const text = data.cell.raw;
              if (text === "✓" || text === "✗") {
                const x = data.cell.x + data.cell.width / 2;
                const y = data.cell.y + data.cell.height / 2;

                // Draw circle
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.2);
                doc.circle(x, y, 3, "S");

                // Set text color based on status
                if (text === "✓") {
                  doc.setTextColor(22, 163, 74); // Green
                } else {
                  doc.setTextColor(220, 38, 38); // Red
                }

                // Draw check/cross mark
                doc.setFontSize(6);
                doc.text(text, x, y + 1, {
                  align: "center",
                  baseline: "middle",
                });

                // Reset text color
                doc.setTextColor(0, 0, 0);
              }
            }
          },
        });
      }

      // Notes Section
      const finalY = doc.lastAutoTable?.finalY || yPos + 10;
      if (finalY < 260) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(37, 99, 235);
        doc.text("NOTES:", 14, finalY + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);

        const splitNotes = doc.splitTextToSize(notes, 175);
        doc.text(splitNotes, 18, finalY + 14);

        // Draw box around notes
        const notesHeight = Math.min(splitNotes.length * 4 + 10, 20);
        doc.setDrawColor(250, 204, 21);
        doc.setLineWidth(0.3);
        doc.roundedRect(14, finalY + 6, 182, notesHeight, 1, 1, "S");
      }

      // Page Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Report ${reportIndex + 1} of ${historyData.length} | Generated: ${formatDateForPDF(new Date().toISOString())}`,
        105,
        pageHeight - 8,
        { align: "center" },
      );
    });

    // Save PDF
    const fileName = "All_Daily_Checks_History.pdf";
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// --- 3. Modal Component for View Report ---
const Modal = ({ report, onClose, baseChecklistItems }) => {
  const { items: checklistItems, loading: checklistLoading } =
    useChecklistItems();

  if (!report) return null;

  if (checklistLoading) {
    return (
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="rounded-lg bg-white p-10 shadow-xl">
          Loading checklist structure...
        </div>
      </div>
    );
  }

  // Data Extraction
  const submittedItems = report.completedForm?.inspectionTable || [];
  const headerInfo = report.completedForm?.headerInfo || {};
  const driverName =
    report.driverName ||
    report.completedForm?.driverName ||
    headerInfo.driverName ||
    report.submissionDetails?.submittedBy?.name ||
    "N/A";
  const notes =
    report.completedForm?.notes ||
    report.submissionDetails?.notes ||
    report.notes ||
    "No notes provided.";
  const submittedAt = report.submissionDetails?.submittedAt || report.date;

  // Use formatted dates
  const date = submittedAt ? formatDate(submittedAt) : headerInfo.date || "N/A";
  const time = submittedAt
    ? new Date(submittedAt).toLocaleTimeString()
    : headerInfo.time || "N/A";

  console.log("🔎 Report Data (selectedReport):", report);
  console.log(
    "📊 Items displayed in Modal (submittedItems from inspectionTable):",
    submittedItems,
  );

  const renderRequirement = (requirement) => {
    if (!requirement) return null;
    const reqText = Array.isArray(requirement)
      ? requirement.join("\n")
      : requirement;
    return reqText
      .split(/\r?\n/)
      .map((req, i) => req.trim() && <p key={i}> {req.trim()}</p>);
  };

  const getCheckStatus = (item, type) => {
    const cleanStatus = (item.status || "").trim().toUpperCase();
    return (
      (type === "FAULTY" && cleanStatus === "FAULTY") ||
      (type === "CORRECT" && cleanStatus === "CORRECT")
    );
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative mx-auto max-h-[95vh] w-full max-w-4xl scale-95 transform overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-black">
          Report Details
        </h3>

        {/* Header Information */}
        <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p className="col-span-2">
            <strong>Submitted By (Driver):</strong>{" "}
            <span className="font-semibold text-blue-700">{driverName}</span>
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Time:</strong> {time}
          </p>
          <p>
            <strong>Vehicle Reg No:</strong>{" "}
            {headerInfo.vehicleRegNo || report.vehicleRegNo || "N/A"}
          </p>
          <p>
            <strong>Plate No:</strong>{" "}
            {headerInfo.plateNo || report.plateNo || "N/A"}
          </p>
          <p>
            <strong>Badge No:</strong>{" "}
            {headerInfo.driverBadgeNo || report.badgeNo || "N/A"}
          </p>
          <p>
            <strong>Mileage:</strong>{" "}
            {headerInfo.mileage || report.mileage || "N/A"}
          </p>
        </div>

        <h4 className="mb-3 text-lg font-semibold text-gray-800">
          Checked Items (CORRECT/FAULTY):
        </h4>

        {/* Checklist Table */}
        <div className="relative overflow-x-auto rounded-md border border-gray-300">
          <table className="w-full min-w-[700px] table-fixed border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left font-medium">
                <th className="w-1/3 border border-gray-300 px-3 py-2">Area</th>
                <th className="w-1/2 border border-gray-300 px-3 py-2">
                  Requirement
                </th>
                <th className="w-[80px] border border-gray-300 px-3 py-2 text-center">
                  FAULTY
                </th>
                <th className="w-[80px] border border-gray-300 px-3 py-2 text-center">
                  CORRECT
                </th>
              </tr>
            </thead>
            <tbody>
              {submittedItems.length > 0 ? (
                submittedItems.map((item, idx) => {
                  const isFaultyChecked = getCheckStatus(item, "FAULTY");
                  const isCorrectChecked = getCheckStatus(item, "CORRECT");

                  return (
                    <tr
                      key={idx}
                      className={idx % 2 !== 0 ? "bg-[#F7F6F666]" : "bg-white"}
                    >
                      <td className="border border-gray-300 px-3 py-2 align-top">
                        {item.area}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 align-top">
                        {renderRequirement(item.requirement)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded border font-bold ${isFaultyChecked ? "border-red-600 bg-red-100 text-red-600" : "border-gray-300 bg-white text-transparent"}`}
                        >
                          {isFaultyChecked ? "✗" : ""}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded border font-bold ${isCorrectChecked ? "border-green-600 bg-green-100 text-green-600" : "border-gray-300 bg-white text-transparent"}`}
                        >
                          {isCorrectChecked ? "✓" : ""}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No checklist items found in the inspection table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <p className="mt-4 break-words text-gray-700">
          <strong>Notes:</strong> {notes}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => generateSingleReportPDF(report, baseChecklistItems)}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. UserHistory Main Component ---
export const UserHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch base checklist items for PDF generation
  const { items: baseChecklistItems } = useChecklistItems();

  // Fetch paginated data
  const fetchHistory = async (pageNumber = 1) => {
    try {
      setLoading(true);
      console.log(
        `-> Attempting to fetch history for page ${pageNumber} (checks?page=${pageNumber})...`,
      );

      const response = await getData(`checks?page=${pageNumber}`);
      console.log("✅ History API Response Received:", response);

      let checks = response.checks || response.data?.checks || [];
      let totalPages = response.pagination?.pages || 1;
      let totalRecords = response.pagination?.total || checks.length;

      if (checks.length === 0 && Array.isArray(response)) {
        checks = response;
        totalPages = 1;
        totalRecords = response.length;
      }

      setHistoryData(checks);
      setTotalPages(totalPages);
      setTotalRecords(totalRecords);

      if (checks.length === 0) {
        console.warn(
          "⚠️ History data array is empty. Check the 'checks' API response structure.",
        );
      }
    } catch (err) {
      console.error("❌ Failed to fetch daily checks history:", err);
      setError(
        "Failed to load history. Please try again later. (Check console for API error)",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const handleExportAllPDF = () => {
    if (historyData.length === 0) {
      alert("No data available to export.");
      return;
    }
    generateAllReportsPDF(historyData, baseChecklistItems);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-[65px] min-h-screen w-full bg-white font-[Inter] lg:mt-0">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mt-1 rounded-2xl border border-gray-200 px-4 py-3 font-['Inter'] sm:mt-2 md:mt-0">
          <div className="items-center md:flex md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700 sm:text-2xl md:text-3xl">
                History
              </h2>
              <p className="my-1.5 text-sm font-normal text-[#9DA1AB]">
                View and manage past daily checks and records.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleExportAllPDF}
                className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:h-14 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              >
                <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="font-['Roboto'] text-sm font-semibold whitespace-nowrap sm:text-base">
                  Export All PDF
                </span>
              </button>
            </div>
          </div>

          {/* Total History */}
          <div className="">
            <h2 className="my-2 text-xl font-semibold text-black md:my-5">
              Total History: {totalRecords}
            </h2>
          </div>

          {/* Table */}
          <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative mb-2 overflow-x-scroll rounded-md border border-gray-300 md:mb-4">
            <table className="w-full min-w-[600px] table-fixed border-collapse text-sm text-gray-700 sm:min-w-[700px] md:min-w-[800px] lg:min-w-[900px] xl:min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left font-medium text-gray-700">
                  <th className="border border-gray-300 px-2 py-2">DATE</th>
                  <th className="border border-gray-300 px-2 py-2">STATUS</th>
                  <th className="border border-gray-300 px-2 py-2">
                    VEHICLE REG NO
                  </th>
                  <th className="border border-gray-300 px-2 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center">
                      Loading history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : historyData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  historyData.map((report) => (
                    <tr key={report.id}>
                      <td className="border border-gray-300 px-2 py-2">
                        {formatDate(
                          report.date ||
                            report.submissionDetails?.submittedAt ||
                            report.completedForm?.headerInfo?.date,
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {(report.status || report.submissionDetails?.status) ===
                        "completed" ? (
                          <span className="inline-flex rounded-full bg-green-200 px-2 py-1 text-xs text-green-800">
                            Complete
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-orange-200 px-2 py-1 text-xs text-orange-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {report.vehicleRegNo ||
                          report.completedForm?.headerInfo?.vehicleRegNo ||
                          "N/A"}
                      </td>

                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="inline-flex items-center gap-1 rounded-md border border-blue-600 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          >
                            View Report
                          </button>
                          <button
                            onClick={() =>
                              generateSingleReportPDF(
                                report,
                                baseChecklistItems,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-green-600 bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-600 hover:text-white"
                          >
                            Download PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="flex items-center text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          report={selectedReport}
          onClose={() => setIsModalOpen(false)}
          baseChecklistItems={baseChecklistItems}
        />
      )}
    </div>
  );
};
