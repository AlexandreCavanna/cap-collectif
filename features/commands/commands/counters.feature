@counters
Feature: Counters computation Commands

@database
Scenario: Cron job wants to compute users counters
  Given I run "capco:compute:users-counters"
  Then the command exit code should be 0

@database
Scenario: Cron job wants to compute users counters
  Given I run "capco:compute:users-counters --force"
  Then the command exit code should be 0
