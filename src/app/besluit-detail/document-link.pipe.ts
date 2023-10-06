import { Pipe, PipeTransform } from '@angular/core';
import { TweedekamerApiService } from '../odata-tweedekamer/tweedekamer-api.service';
import type { Document } from '../../../functions/src/tweedekamer-api.types';

@Pipe({
  name: 'documentLink',
  standalone: true,
})
export class DocumentLinkPipe implements PipeTransform {
  transform(document: Document): string {
    const documentUrl = this.tweedekamerApi.getDocumentUrl(document);
    return documentUrl;
  }

  constructor(private tweedekamerApi: TweedekamerApiService) {}
}
