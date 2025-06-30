import generatePDF from 'react-to-pdf';

/**
 * Generates a PDF from a React component reference
 * @param targetRef - React ref to the component to convert to PDF
 * @param filename - Name of the PDF file (without .pdf extension)
 * @param options - Additional PDF generation options
 */
export const generatePdfFromComponent = async (
  targetRef: React.RefObject<HTMLDivElement | null>,
  filename: string = 'document',
  options?: {
    page?: {
      format?: string;
      orientation?: 'portrait' | 'landscape';
    };
    canvas?: {
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
    };
  }
) => {
  try {
    if (!targetRef.current) {
      throw new Error('Target element not found');
    }

    const pdfOptions = {
      filename: `${filename}.pdf`,
      page: {
        format: 'A4',
        orientation: 'portrait' as const,
        ...options?.page,
      },
      canvas: {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        ...options?.canvas,
      },
    };

    await generatePDF(targetRef, pdfOptions);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generates a PDF for a creature/character sheet
 * @param targetRef - React ref to the character sheet component
 * @param creatureName - Name of the creature for the filename
 */
export const generateCharacterSheetPdf = async (
  targetRef: React.RefObject<HTMLDivElement | null>,
  creatureName: string
) => {
  const sanitizedName = creatureName.replace(/[^a-zA-Z0-9]/g, '_');
  return generatePdfFromComponent(
    targetRef,
    `character_sheet_${sanitizedName}`,
    {
      page: {
        format: 'A4',
        orientation: 'portrait',
      },
      canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      },
    }
  );
};
