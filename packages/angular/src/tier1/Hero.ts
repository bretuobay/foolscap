import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface HeroProps {
  variant?: 'default' | 'split'
}

@Component({
  selector: 'section[fc-hero], fc-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-hero',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Hero {
  @Input() variant: NonNullable<HeroProps['variant']> = 'default'
}

@Component({
  selector: 'p[fc-hero-eyebrow], fc-hero-eyebrow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-hero__eyebrow' },
})
export class HeroEyebrow {}

@Component({
  selector: 'h1[fc-hero-title], fc-hero-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-hero__title' },
})
export class HeroTitle {}

@Component({
  selector: 'p[fc-hero-description], fc-hero-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-hero__description' },
})
export class HeroDescription {}

@Component({
  selector: 'fc-hero-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-hero__actions' },
})
export class HeroActions {}
