import { TemplateRef } from '@angular/core';

export interface ModalSpec {
  tpl: TemplateRef<any>;
  spec: {
    width: string,
  },
  state: any,
};
