const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

const generateDeliveryNotePDF = (deliveryNote) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = new PassThrough();

    doc.pipe(stream);

    doc.fontSize(24).text('Albarán de Entrega');
    doc.moveDown();

    // Fecha y responsable
    doc.fontSize(12);
    doc.text(`Fecha: ${new Date(deliveryNote.date).toLocaleDateString()}`);
    doc.text(`Responsable: ${deliveryNote.name}`);
    doc.moveDown();

    // Empresa
    doc.fontSize(16).text('Empresa');
    const company = deliveryNote.company;
    const companyAddress = company.address;
    doc.fontSize(12).fillColor('black');
    doc.text(`Nombre: ${company.name}`);
    doc.text(`CIF: ${company.cif}`);
    doc.text(`Dirección: ${companyAddress.street || ''} ${companyAddress.number || ''}, ${companyAddress.postal || ''} ${companyAddress.city || ''} (${companyAddress.province || ''})`);
    doc.moveDown();

    // Cliente
    doc.fontSize(16).text('Cliente');
    const client = deliveryNote.client || {};
    const clientAddress = client.address || {};
    doc.fontSize(12).fillColor('black');
    doc.text(`Nombre: ${client.name || ''}`);
    doc.text(`CIF: ${client.cif || ''}`);
    doc.text(`Dirección: ${clientAddress.street || ''} ${clientAddress.number || ''}, ${clientAddress.postal || ''} ${clientAddress.city || ''} (${clientAddress.province || ''})`);
    doc.moveDown();

    // Proyecto
    doc.fontSize(16).text('Proyecto');
    doc.fontSize(12);
    doc.text(`ID: ${deliveryNote.project}`);
    doc.moveDown();

    // Descripción y detalles
    doc.fontSize(16).text('Detalles');
    doc.fontSize(12);
    doc.text(`Descripción: ${deliveryNote.description}`);
    doc.text(`Formato: ${deliveryNote.format}`);
    doc.text(`Horas: ${deliveryNote.hours}`);
    doc.moveDown();

    // Trabajadores (lista)
    doc.fontSize(16).text('Trabajadores');
    doc.fontSize(12);
    if (deliveryNote.workers && deliveryNote.workers.length > 0) {
        deliveryNote.workers.forEach((worker, index) => {
        doc.text(`${index + 1}. ${worker}`);
        });
    } else {
        doc.text('No hay trabajadores asignados.');
    }

    doc.end();

    return stream;
};

module.exports = { generateDeliveryNotePDF };
