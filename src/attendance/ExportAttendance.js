import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ← must import this wa

const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for CORS
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = reject;
    });
};

export const exportAttendanceToPDF = async (data) => {
    const table = document.querySelector('.table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    const bodyData = [];

    // Headers
    const headerCells = rows[0].querySelectorAll('th, td');
    const headers = ['No.'];
    for (let i = 1; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText.trim().replace(/\n/g, ' '));
    }

    headers[1] = 'Full Name'; // just override that specific column

    // Body rows
    let counter = 1;
    for (let i = 2; i < rows.length; i++) {
        const cols = rows[i].querySelectorAll('td');
        if (!cols.length) continue;

        const rowData = [counter++];

        const nameElements = cols[1].querySelectorAll('.formatName');
        let fullName = '';
        nameElements.forEach(el => {
            if (!el.classList.contains('d-none')) {
                fullName = el.innerText.trim();
            }
        });
        rowData.push(fullName);

        for (let j = 2; j < cols.length; j++) {
            const status = cols[j].querySelector('p')?.innerText.trim() || '--';
            rowData.push(status);
        }

        bodyData.push(rowData);
    }

    const doc = new jsPDF(
        {
            orientation: data.type === 'Sundays' ? 'portrait' : 'landscape', // change to 'landscape' if needed
            // format: 'A4'
            // unit: 'pt', // use points for finer control
        }
    );

    // Base64 image (example only – replace with your real image)
    const logoBase64 = await loadImageAsBase64(data.churchLogo)

    autoTable(doc, {
        startY: 37,  // 👈 Ensures the table starts after your custom header
        margin: { top: 37 },        // Applies to all pages 👈 FIX!
        head: [headers],
        body: bodyData,
        styles: {
            fontSize: 8,         // ↓ reduce font size
            cellPadding: 2,      // ↓ reduce padding
            lineHeight: 1,       // ↓ tighter rows
            cellPadding: 1,
            halign: 'center',
            valign: 'middle',
            lineWidth: data.theme === 'grid' ? 0.1 : 0,              // ⬅️ Border thickness
            lineColor: [0, 0, 0],        // ⬅️ Border color (black)
        },
        columnStyles: {
            1: {
                halign: 'left', // apply to both head and body
                cellWidth: 35 // or fixed like 60 if needed
            }
        },

        // 👇 Header styles
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [60, 60, 60],
            halign: 'center',
            // lineWidth: 0.5,              // ⬅️ Thicker border for header
            lineColor: [0, 0, 0],
        },
        // 👇 Optional: grid theme adds boxed layout
        theme: data.theme,           // Themes: 'striped', 'grid', 'plain'
        // 👇 This makes the header repeat on every page
        didDrawPage: function (dataTable) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const logoSize = 20;

            // === HEADER (repeats every page) ===

            // Logo
            doc.addImage(logoBase64, 'PNG', 13, 5, logoSize, logoSize);

            // Church Name
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text(data.churchName, pageWidth / 2, 12, { align: 'center' });

            // Church Address
            doc.setFontSize(10);
            doc.setFont('times', 'normal');
            doc.text(data.churchAddress, pageWidth / 2, 17, { align: 'center' });

            // Report Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(data.type + data.reportTitle, pageWidth / 2, 27, { align: 'center' });

            // Subtext
            doc.setFontSize(8);
            doc.text(data.subText, pageWidth / 2, 31, { align: 'center' });

            // === FOOTER (page number) ===
            const pageCount = doc.internal.getNumberOfPages();
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 20, pageHeight - 10, {
                align: 'right'
            });
        }
    });

    const fileName = data.type + data.reportTitle.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(fileName + '.pdf');
};
