import { CanDeactivateFn } from '@angular/router';

export interface ComponentWithUnsavedChanges {
  canDeactivate(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<ComponentWithUnsavedChanges> = (component) =>
  component.canDeactivate();