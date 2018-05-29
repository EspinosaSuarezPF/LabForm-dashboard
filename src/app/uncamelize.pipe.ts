import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uncamelize'
})
export class UncamelizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
