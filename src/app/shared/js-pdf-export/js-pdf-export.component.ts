import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PDFWrapperService } from '@app/core/services/pdf-wrapper.service';
import { ImageOptions, jsPDF, jsPDFOptions } from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-js-pdf-export',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [PDFWrapperService],
  templateUrl: './js-pdf-export.component.html',
  styleUrls: ['./js-pdf-export.component.scss'],
})
export class JsPdfExportComponent implements OnInit {
  @ContentChild('JsExportPdfFooterTemplate') public footerTemplate!: TemplateRef<unknown>;
  @ViewChild('pdfContainer') private pdfContainer: any;
  @ViewChild('pdfFooter') private pdfFooter: any;
  @Input() margin = 50;
  @Input() options: jsPDFOptions = { orientation: 'p', unit: 'pt' };
  @Input() fileName = 'export-' + (new Date()).toISOString() + '.pdf';


  public currentDate: string = new Date().toLocaleDateString();
  public currentTime: string = new Date().toLocaleTimeString();
  public pageNumber = 1;
  public totalPages = 0;

  constructor(
    private appRef: ApplicationRef,
    private pdfWrapper: PDFWrapperService
  ) { }

  ngOnInit(): void {
    /**
     * Get the current date in the format August 15, 2019
     */
    this.currentDate = moment(moment.now()).format('LL');
    /**
     * Get the current time in the format 3:55:30 PM
     */
    this.currentTime = moment(moment.now()).format('LTS');
  }

  public generatePdfFromComponent(fileName: string, options: jsPDFOptions = { orientation: 'p', unit: 'mm', format: 'a4' }) {
    this.appRef.tick();
    const element = this.pdfContainer.nativeElement;
    if (!element) {
      console.error('PDF container element not found');
      return;
    }

    const pdfOptions: jsPDFOptions = {
      ...this.options,
      ...options,
    }

    // Use html2canvas to capture the element and convert it to an image
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      this.pdfWrapper.addOptions(pdfOptions);
      const imgWidth = 208; // A4 width in mm, adjust as needed
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imageOption = {
        imageData: imgData,
        format: 'PNG',
        x: 0,
        y: position,
        width: imgWidth,
        height: imgHeight
      } as ImageOptions;
      this.pdfWrapper.addImage(imageOption);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        this.pdfWrapper.addPage();
        this.pdfWrapper.addImage(imageOption);
        heightLeft -= pageHeight;
      }

      this.pdfWrapper.save(fileName + '.pdf');
    });
  }


  private async findTotalPages(options: jsPDFOptions) {
    // workaround to remove error message when opening a multi-page PDF with Adobe Acrobat.
    await new jsPDF(options).html(this.pdfContainer.nativeElement, {
      callback: (res) => {
        this.totalPages = res.getNumberOfPages();
        console.log('Total Pages:', this.totalPages);
      },
    });
  }

  private async prepare(options: jsPDFOptions) {
    this.appRef.tick();
    const element = this.pdfContainer.nativeElement;
    if (!element) {
      console.error('PDF container element not found');
      return;
    }

    const pdfOptions: jsPDFOptions = {
      ...this.options,
      ...options,
    }

    await this.findTotalPages(pdfOptions);

    this.pdfWrapper.addOptions(pdfOptions).addHtml(this.pdfContainer.nativeElement, {
      margin: [0, 0, this.margin, 0],
      autoPaging: 'text',
    });

    for (let i = 2; i <= this.totalPages; i++) {
      this.pdfWrapper.addPage();
    }

    this.pdfWrapper.addHtml(this.pdfContainer.nativeElement, {
      margin: [0, 0, this.margin, 0],
      autoPaging: 'text',
    });

    // also init page number
    this.pageNumber = 1;
    // afterwards enable the footer
    const pageInfo = this.pdfWrapper.getPageInfo();
    const yOffset = pageInfo?.pageContext?.mediaBox?.topRightY;

    const newFooter = this.pdfFooter.nativeElement;
    while (this.pageNumber <= this.totalPages) {
      this.appRef.tick();
      this.pdfWrapper.setPage(this.pageNumber);

      // set footer
      await this.pdfWrapper.addHtml(newFooter, {
        x: 1,
        y: yOffset * this.pageNumber - 1,
      });

      //!Important you increase the page number
      this.pageNumber++;
    }
  }

  public async saveAs(fileName: string, options: jsPDFOptions = { orientation: 'p', unit: 'pt' }): Promise<void> {
    await this.prepare(options);
    // Save the PDF
    await this.pdfWrapper.save(fileName + '.pdf');
  }

  public async download(fileName: string, options: jsPDFOptions = { orientation: 'p', unit: 'pt' }): Promise<void> {
    await this.saveAs(fileName, options);
  }

  public view(title?: string): void {
    this.pdfWrapper.view(title);
  }

  public viewOnNewTab(title?: string): void {
    this.pdfWrapper.viewOnNewTab(title);
  }

  public async getPDFasArrayBuffer(options: jsPDFOptions = { orientation: 'p', unit: 'pt' }): Promise<ArrayBuffer> {
    await this.prepare(options);
    return this.pdfWrapper.getPDFasArrayBuffer();
  }

  public async getPDFasBlob(options: jsPDFOptions = { orientation: 'p', unit: 'pt' }): Promise<Blob> {
    await this.prepare(options);
    const arrayBuffer = await this.pdfWrapper.getPdfAsUriString();
    return new Blob([arrayBuffer], { type: 'application/pdf' });
  }

  public async getPDFasBase64(options: jsPDFOptions = { orientation: 'p', unit: 'pt' }): Promise<string> {
    const blob = await this.getPDFasBlob(options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


}
