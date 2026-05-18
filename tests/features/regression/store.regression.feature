@regression
Feature: Store regression coverage
  As a test team
  I want critical user journeys automated
  So that full regression checks can run in the same BDD execution as component scenarios

  Scenario: Invalid credentials show a warning
    Given the user is on the login page
    When the user logs in with invalid credentials
    Then a login warning is displayed
    And the user remains on the login page

  Scenario: Shopper can open the login page from the home page
    Given the user opens the store home page
    When the user opens the account menu
    And the user chooses the login option
    Then the login page is displayed

  Scenario: New shopper can register an account
    Given the user is on the registration page
    When the user registers a new account
    Then the account creation success message is displayed
