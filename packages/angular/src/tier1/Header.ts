import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'header[fc-header]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-header' },
})
export class Header {}

@Component({
  selector: 'a[fc-header-brand]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-header__brand' },
})
export class HeaderBrand {}

@Component({
  selector: 'nav[fc-header-nav]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-header__nav' },
})
export class HeaderNav {}

@Component({
  selector: 'fc-header-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-header__actions' },
})
export class HeaderActions {}
