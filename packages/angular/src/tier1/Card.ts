import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface CardProps {
  variant?: 'default' | 'flat' | 'elevated'
  as?: 'article' | 'div' | 'section'
}

@Component({
  selector: 'fc-card, article[fc-card], div[fc-card], section[fc-card]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-card',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Card {
  @Input() variant: NonNullable<CardProps['variant']> = 'default'
  @Input() as: NonNullable<CardProps['as']> = 'article'
}

@Component({
  selector: 'fc-card-media',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-card__media' },
})
export class CardMedia {}

@Component({
  selector: 'fc-card-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-card__body' },
})
export class CardBody {}

@Component({
  selector: 'h3[fc-card-title], fc-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-card__title' },
})
export class CardTitle {}

@Component({
  selector: 'p[fc-card-description], fc-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-card__description' },
})
export class CardDescription {}

@Component({
  selector: 'fc-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-card__footer' },
})
export class CardFooter {}
