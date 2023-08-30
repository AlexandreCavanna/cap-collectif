@import
Feature: Import Commands

@database @elasticsearch
Scenario: Admin wants to load prod data
  Given I run "capco:load-prod-data --force"
  Then the command exit code should be 0
  Then I run "capco:es:populate"
  Then the command exit code should be 0

@database
Scenario: Admin wants to import a consultation
  Given "opinions.csv" contains:
  """
  titre,type,contenu
  Article 8 bis d'la street avec "ça",Titre Ier|Chapitre Ier|Section 1, Blabla premier alinéa du I de l'article L. 371-1 du code de l'environnement est complété par les mots : « ainsi que la gestion de la lumière artificielle la nuit ».À l’échelon régional, il est proposé à l’article 7 de transformer les comités régionaux « trames verte et bleue » en comités régionaux de la biodiversité cités à l’article L. 371-3. Cette modification consiste principalement en un changement de nom, les comités régionaux actuels ayant déjà la possibilité d’aborder un champ large de questions touchant à la biodiversité au-delà de la politique de la trame verte et bleue. Pour autant, un ajustement de leurs missions et une modification des dispositions encadrant leur composition devront être opérées notamment pour y intégrer le cas échéant des représentants des enjeux marins. Des dispositions transitoires de maintien en l’état des instances régionales sont introduites de manière à ne pas devoir remettre en cause les instances actuelles « comités régionaux trame verte et bleue », très récemment installés et en plein travail d’élaboration des schémas régionaux de cohérence écologique, dont l’adoption doit rester la priorité actuelle de travail de ces comités."
  """
  Given I run "capco:import:consultation-from-csv vfs://opinions.csv admin@test.com elaboration-de-la-loi --delimiter ','"
  Then the command exit code should be 0
  And I should see "1 opinions successfully created." in output

@database
# author can be either an existing user email or a unique Username
Scenario: Admin wants to import a BP
  Given "proposals.csv" contains:
  """
  name;author;district_name;address;collect_status;estimation;category;summary;body;"Evaluez l'importance de votre proposition";"Evaluez le coût de votre proposition"
  new proposition 1;aurelien@cap-collectif.com;Nord Saint-Martin;5 Allée Rallier-du-Baty 35000 Rennes;Rejeté;200 euros;Politique;blalala;blalblal body;très important;gratuit
  new proposition 2;Pierre Michel;Nord Saint-Martin;cacccccccccccccccccccccccccccccccccccccccccccxxxxxx;Rejeté;200 euros;Politique;blalala;blalblal body;nulle;pas chère
  new proposition 3;Pierre Michel;Nord Saint-Martin;cacccccccccccccccccccccccccccccccccccccccccccxxxxxx;Rejeté;200 euros;Politique;blalala;blalblal body;nulle;pas chère
  """
  Given I run "capco:import:proposals-from-csv vfs://proposals.csv proposalForm1"
  Then the command exit code should be 0
  And I should see "Creating a new user with a fake email and username: Pierre Michel" in output

@database
Scenario: Cap Collectif wants to create some users account from a CSV with custom fields
  Given "users.csv" contains:
  """
  email;username;Champ pas facultatif;Champ facultatif;Sangohan / Vegeta ?
  user_a@cap-collectif.com;Jean Michel;toto;tata;Sangohan
  user_b@cap-collectif.com;Po Paul;popo;popaul;Vegeta
  duplicated@cap-collectif.com;Duplicate;Duplicate;Duplicate;Vegeta
  duplicated@cap-collectif.com;Duplicate;Duplicate;Duplicate;Vegeta
  admin@cap-collectif.com;Already Present;Already Present;Already Present;Vegeta
  """
  Given a file "users_created.csv" is prepared to be written on vsf
  Given I run a command "capco:create-users-account-from-csv" with parameters:
    | input | vfs://users.csv |
    | output | vfs://users_created.csv |
    | --with-custom-fields | true |
  Then the command exit code should be 0
  And I should see "Skipping 1 duplicated email(s)." in output
  And I should see "Skipping existing user: admin@cap-collectif.com" in output
  And I should see "[OK] 3 users created." in output
  Then the file "users_created.csv" should exist
  Then "users_created.csv" should start with:
  """
  email;confirmation_link
  """
  Then print the contents of file "users_created.csv"
  And user "user_a@cap-collectif.com" has response "toto" to question "6"
  And user "user_a@cap-collectif.com" has response "tata" to question "7"
  And user "user_a@cap-collectif.com" has response "Sangohan" to question "17"
  And user "user_b@cap-collectif.com" has response "popo" to question "6"
  And user "user_b@cap-collectif.com" has response "popaul" to question "7"
  And user "user_b@cap-collectif.com" has response "Vegeta" to question "17"

@database
Scenario: Cap Collectif wants to create some users account from a CSV with only firstname and lastname
  Given "users.csv" contains:
  """
  first_name;last_name
  Johnny;Yadlidée
  Jean-Michel;Palaref
  """
  Given a file "users_created.csv" is prepared to be written on vsf
  Given I run a command "capco:create-users-account-from-csv" with parameters:
    | input | vfs://users.csv |
    | output | vfs://users_created.csv |
    | --with-password | true |
    | --generate-email | cap-collectif.com |
  Then the command exit code should be 0
  And I should see "[OK] 2 users created." in output
  Then the file "users_created.csv" should exist
  Then "users_created.csv" should start with:
  """
  first_name;last_name;email;password
  """
  And user "Johnny Yadlidée" should have email "johnny-yadlidee@cap-collectif.com"
  And user "Jean-Michel Palaref" should have email "jean-michel-palaref@cap-collectif.com"
  Then print the contents of file "users_created.csv"

@database
Scenario: Admin wants to import users from a CSV
  Given "users.csv" contains:
  """
  username;email;password
  john.doe;user_a@test.com;test
  mcfly;user_b@test.com;carlito
  """
  Given I run "capco:import:users vfs://users.csv --delimiter ';'"
  Then the command exit code should be 0
  And I should see "2 users successfully created." in output

@database
Scenario: Admin wants to import idf users from a CSV
  Given "users.csv" contains:
  """
  "username";"email";"openid_id"
  "toto";"toto@test.com";"openidtoto"
  "titi";"titi@test.com";"openidtiti"
  "tata";"tata@test.com";"openid_tata"
  "titi";"titi@test.com";"openidtiti"
  "admin";"admin@test.com";"openidadmin"
  "";;
  """
  Given I run "capco:import:idf-users vfs://users.csv --delimiter ';'"
  Then the command exit code should be 0
  And I should see "3 users successfully created." in output
  And I should see "3 lines with errors" in output
  And I should see "On line 4 : email titi@test.com is already used, opendId id openidtiti is already used" in output
  And I should see "On line 5 : email admin@test.com is already used" in output
  And I should see "On line 6 : missing email, missing openId id" in output

@database
Scenario: Admin wants to import a IDF BP
  Given I run "capco:import:idf-proposals-from-csv /__snapshots__/imports/proposals_idf_bp3_cli.csv proposalformIdfBP3 -d ,"
  Then the command exit code should be 0
  And I should see "4 proposals successfully created." in output
  And I should see "2 bad data. Lines : 2,3  are bad and not imported." in output
  And I should see "1 mandatory fields missing. Lines : 8 missing somes required data and not imported." in output

#@database @dev TO REFORGE
#Scenario: Admin wants to import a IDF BP, test detect duplicated
#  Given I run "capco:import:idf-proposals-from-csv /__snapshots__/imports/proposals_idf_bp3_cli.csv proposalformIdfBP3 -d , --skipDuplicateLines=true"
#  Then the command exit code should be 0
#  And I should see "3 proposals successfully created." in output
#  And I should see "1 mandatory fields missing. Lines : 8 missing somes required data and not imported." in output
#  And I should see "Lines : 7 already existent and not imported." in output

Scenario: Admin wants to generate csv model type to import proposals
  Given I run "capco:import-proposals:generate-header-csv proposalformIdfBP3 -d ,"
  And exported "csv" model file with name "Budget_Participatif_IdF_3-Collecte_des_projets_Idf_BRP_3_vierge.csv" should match its snapshot
  Then the command exit code should be 0

Scenario: Admin wants to generate csv model type to import proposals
  Given I run "capco:import-proposals:generate-header-csv proposalForm1 -d ,"
  And exported "csv" model file with name "Budget_Participatif_Rennes-Collecte_des_propositions_vierge.csv" should match its snapshot
  Then the command exit code should be 0

Scenario: Admin wants to generate csv model type to import proposals
  Given I run "capco:import-proposals:generate-header-csv proposalformCafetier -d ,"
  And exported "csv" model file with name "Sauvons_nos_cafes-Soutenons_nos_bistros_et_cafes_dans_cette_periode_difficile_vierge.csv" should match its snapshot
  Then the command exit code should be 0
