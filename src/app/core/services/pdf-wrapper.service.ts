import { Injectable } from '@angular/core';
import jsPDF, { HTMLOptions, HTMLWorker, ImageOptions, jsPDFOptions, PageInfo, TextOptionsLight } from 'jspdf';
export type PDFOptions = jsPDFOptions;

@Injectable({
  providedIn: 'root',
})
export class PDFWrapperService {
  private defaultOptions: jsPDFOptions = { orientation: 'portrait', unit: 'pt' };
  private pdfMaker = new jsPDF(this.defaultOptions);

  /**
   * Only use this getter if you're absolutely sure you are unable
   * to implement internally the needed function inside this Wrapper class.
   */
  public get getPdfMaker(): jsPDF {
    return this.pdfMaker;
  }

  public init(jsPdf: jsPDF): PDFWrapperService {
    this.pdfMaker = jsPdf;
    return this;
  }

  /**
   * @param {jsPDFOptions} options
   * THis will act as a factory method to replace the current service with one with options
   * @return {void}
   **/
  public addOptions(options: jsPDFOptions): PDFWrapperService {
    this.pdfMaker = new jsPDF({ ...this.defaultOptions, ...options });
    return this;
  }

  /**
   * @param properties
   * @returns
   */
  public setProperties(properties: { [key: string]: string }): PDFWrapperService {
    this.pdfMaker.setProperties(properties);
    return this;
  }

  /**
   * @param font
   * @param style
   * @returns
   */
  public setFont(font: string, style?: string): PDFWrapperService {
    this.pdfMaker.setFont(font, style);
    return this;
  }

  /**
   * Use this to ADD a new page to your PDF.
   */
  public addPage(): PDFWrapperService {
    this.pdfMaker.addPage();
    return this;
  }

  /**
   * Use this to ADD text to you PDF.
   */
  public addText(
    text: string | string[],
    x: number,
    y: number,
    options?: TextOptionsLight,
    transform?: number | unknown
  ): PDFWrapperService {
    this.pdfMaker.text(text, x, y, options, transform);
    return this;
  }

  /**
   * Use this to ADD a new image to your PDF.
   */
  public addImage(option: ImageOptions): PDFWrapperService {
    this.pdfMaker.addImage(option);
    return this;
  }

  public getNumberOfPages(): number {
    return this.pdfMaker.getNumberOfPages();
  }

  public setPage(page: number): PDFWrapperService {
    this.pdfMaker.setPage(page);
    return this;
  }

  public getCurrentPageInfo(page: number): PageInfo {
    return this.pdfMaker.getPageInfo(page);
  }

  public getPageInfo(): PageInfo {
    return this.pdfMaker.getCurrentPageInfo();
  }

  public getLineHeight(): number {
    return this.pdfMaker.getLineHeight();
    // return this.pdfMaker.getPageInfo(page);
  }

  public setFontSize(size: number): PDFWrapperService {
    this.pdfMaker.setFontSize(size);
    return this;
  }

  public async addHtml(src: string | HTMLElement, options?: HTMLOptions): Promise<HTMLWorker> {
    await this.pdfMaker.html(src, options);
    return this;
  }

  /**
   * Use this to download the PDF file.
   */
  public save(filename?: string, options?: { returnPromise: true }): PDFWrapperService | Promise<void> {
    if (options == null) {
      this.pdfMaker.save(filename); //To download the PDF file.
      return this;
    }
    //To download the PDF file and Attach a callback function inside a promise
    return this.pdfMaker.save(<string>filename, options);
  }

  /**
   * To View PDF in the current Tab/Window
   */
  public view(title?: string): PDFWrapperService {
    this.pdfMaker.setProperties({ title });
    this.pdfMaker.output('datauri');
    return this;
  }

  /**
   * To View PDF in New Tab/Window
   */
  public viewOnNewTab(title?: string): PDFWrapperService {
    this.pdfMaker.setProperties({ title }); //Set Title for the PDF in New Tab
    this.pdfMaker.output('dataurlnewwindow');
    return this;
  }

  /**
   * To get PDF as Blob String and control how you want to show it or download it.
   * You can either be in current tab, new tab, or embed in-browser inside a frame.
   */
  public getPdfAsUriString(): string {
    return this.pdfMaker.output('datauristring');
    //For Frame Preview:
    // var string = doc.output('datauristring');
    // var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    // var x = window.open();
    // x.document.open();
    // x.document.write(iframe);
    // x.document.close();
  }

  public getPDFasArrayBuffer() {
    return this.pdfMaker.output('arraybuffer');
  }
}
