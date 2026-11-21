import { Locator, Page } from '@playwright/test';

export class EmployeeCardPage {
  readonly organizationUnit: Locator;
  readonly jobTitle: Locator;
  readonly seniorityLevel: Locator;
  readonly geography: Locator;

  constructor(private readonly page: Page) {
    this.organizationUnit = this.getValueForLabel('Organizational unit');
    this.jobTitle = this.getValueForLabel('Job title');
    this.seniorityLevel = this.getValueForLabel('Seniority level');
    this.geography = this.getValueForLabel('Geography');
  }

  private getValueForLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('..').locator('dd');
  }
}
