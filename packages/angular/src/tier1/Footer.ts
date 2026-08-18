import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'footer[fc-footer]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-footer' },
})
export class Footer {}

@Component({
  selector: 'fc-footer-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-footer__grid' },
})
export class FooterGrid {}

@Component({
  selector: 'h2[fc-footer-section-title]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-footer__section-title' },
})
export class FooterSectionTitle {}

@Component({
  selector: 'ul[fc-footer-links]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-footer__links' },
})
export class FooterLinks {}

@Component({
  selector: 'fc-footer-bottom',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-footer__bottom' },
})
export class FooterBottom {}
