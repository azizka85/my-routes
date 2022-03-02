export class ResponseMock {
  statusCode = 200;
  contentType = '';
  content = '';

  get status() {
    return this.statusCode;
  }

  setHeader(name: string, value: string) {
    if(name === 'Content-Type') {
      this.contentType = value;
    }
  }

  write(content: string) {
    this.content = content;
  }

  text() {
    return this.content;
  }

  json() {
    return JSON.parse(this.content);    
  }
}
