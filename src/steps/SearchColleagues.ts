import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { EmployeeCardPage } from '../pages/EmployeeCardPage';
import { SearchColleaguesPage } from '../pages/SearchColleaguesPage';
import { page } from './world';

let selectedFilterOption: string | undefined;

function getSearchColleaguesPage(): SearchColleaguesPage {
  return new SearchColleaguesPage(page);
}

function validateNameOrRoleField(fieldName: string): void {
  if (fieldName.toLowerCase() !== 'nameorrole') {
    throw new Error(`Unsupported search field: "${fieldName}"`);
  }
}

function getFilterDropdown(filterName: string) {
  if (filterName.toLowerCase() !== 'jobtitle') {
    throw new Error(`Unsupported colleague filter: "${filterName}"`);
  }

  return page.getByText('Job title', { exact: true }).locator('..').getByRole('combobox');
}

function readCount(text: string, pattern: RegExp, source: string): number {
  const match = text.match(pattern);
  if (!match) {
    throw new Error(`Could not read the count from ${source}: "${text}".`);
  }

  const count = Number(match[1].replace(/,/g, ''));
  if (!Number.isSafeInteger(count)) {
    throw new Error(`Invalid count in ${source}: "${text}".`);
  }

  return count;
}

async function expectCounterToMatchResults(): Promise<void> {
  const searchColleaguesPage = getSearchColleaguesPage();
  const colleaguesCount = readCount(
    await searchColleaguesPage.colleaguesCountBadge.innerText(),
    /^([\d,]+)$/,
    'colleaguesCountBadge',
  );
  const paginationText = await searchColleaguesPage.paginationTotalCount.innerText();
  const paginationTotalCount = readCount(
    paginationText,
    /items of\s+([\d,]+)/i,
    'paginationTotalCount',
  );
  expect(colleaguesCount).toBe(paginationTotalCount);
}

When(
  'I enter a partial name {string} in the {string} field',
  async function (name: string, fieldName: string) {
    validateNameOrRoleField(fieldName);
    await getSearchColleaguesPage().nameOrRoleField.fill(name);
  },
);

When('I click the {string} button', async function (buttonName: string) {
  if (buttonName.toLowerCase() !== 'search') {
    throw new Error(`Unsupported button: "${buttonName}"`);
  }

  const searchButton = getSearchColleaguesPage().searchButton;
  await expect(searchButton).toBeEnabled();
  await searchButton.click();

  // Wait 2 seconds after clicking the Search button
  await searchButton.page().waitForTimeout(2000);
});

Then('colleague cards should contain {string}', async function (text: string) {
  const colleagueCards = getSearchColleaguesPage().colleagueCard;
  await expect(colleagueCards.filter({ hasText: text }).first()).toBeVisible();
});

Then('the colleague counter above should reflect the current results', async function () {
  await expectCounterToMatchResults();
});

When('I enter {string} in the {string} field', async function (text: string, fieldName: string) {
  validateNameOrRoleField(fieldName);
  await getSearchColleaguesPage().nameOrRoleField.fill(text);
});

When('I select a {string} from the filter dropdown', async function (filterName: string) {
  const dropdown = getFilterDropdown(filterName);
  await expect(dropdown).toBeVisible();
  await dropdown.click();
});

When('select a {string} from the filter dropdown', async function (optionText: string) {
  await page.getByRole('option', { name: optionText, exact: true }).click();
  selectedFilterOption = optionText;
});

Then('colleague cards name should be displayed with {string}', async function (name: string) {
  const matchingCard = getSearchColleaguesPage().colleagueCard.filter({ hasText: name }).first();
  await expect(matchingCard).toBeVisible();
});


When('I click {string}', async function (buttonName: string) {
  if (buttonName.toLowerCase() !== 'reset filters') {
    throw new Error(`Unsupported button: "${buttonName}"`);
  }

  await page.getByRole('button', { name: buttonName, exact: true }).click();
});

Then('the search input and active filters should be cleared', async function () {
  await expect(getSearchColleaguesPage().nameOrRoleField).toHaveValue('');

  if (selectedFilterOption) {
    await expect(getFilterDropdown('jobTitle')).not.toContainText(selectedFilterOption);
    selectedFilterOption = undefined;
  }
});

Then('I should see {string}', async function (text: string) {
  await expect(page.getByText(text, { exact: true })).toBeVisible();
});

When('I click on the colleagueCard', async function () {
  const profileLink = getSearchColleaguesPage()
    .colleagueCard.first()
    .locator('a[href*="/platform/profile/"]');
  await expect(profileLink).toBeVisible();
  await profileLink.click();
  await expect(page).toHaveURL(/\/platform\/profile\//);
});

Then(
  'I should see Organizzation Unit should be {string}',
  async function (organizationUnit: string) {
    await expect(new EmployeeCardPage(page).organizationUnit).toHaveText(organizationUnit);
  },
);

Then('I should see Job Title should be {string}', async function (jobTitle: string) {
  await expect(new EmployeeCardPage(page).jobTitle).toHaveText(jobTitle);
});

Then(
  'I should see Seniority level should be {string}',
  async function (seniorityLevel: string) {
    await expect(new EmployeeCardPage(page).seniorityLevel).toHaveText(seniorityLevel);
  },
);

Then('I should see Geography should be {string}', async function (geography: string) {
  await expect(new EmployeeCardPage(page).geography).toHaveText(geography);
});
