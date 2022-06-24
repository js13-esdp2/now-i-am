import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'image'
})
export class ImagePipes implements  PipeTransform{
  transform(value?: string) {
    if (value) {
      return environment.apiUrl + '/uploads/' + value;
    }

    return '/assets/images/pipe-image.jpg';
  }
}
