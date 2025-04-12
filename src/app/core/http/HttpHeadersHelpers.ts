
export class HttpHeadersHelpers {

  static getAuthorization(token: string): { [key: string]: string } {
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  static getJsonContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  static getJsonContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static getFormUrlEncodedContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
  }

  static getFormUrlEncodedContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static getMultipartFormDataContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    };
  }

  static getMultipartFormDataContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static getXmlContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    };
  }

  static getXmlContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Authorization': `Bearer ${token}`
    };
  }

  static getTextContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'text/plain',
      'Accept': 'text/plain'
    };
  }

  static getTextContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'text/plain',
      'Accept': 'text/plain'
    };
  }

  static getPdfContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf'
    };
  }

  static getPdfContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${token}`
    };
  }

  static getOctetStreamContentTypeHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    };
  }

  static getOctetStreamContentTypeHeadersWithToken(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream',
      'Authorization': `Bearer ${token}`
    };
  }

  static getAcceptAllContentTypeHeaders(): { [key: string]: string } {
    return {
      'Accept': '*/*'
    };
  }
}
