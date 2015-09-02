Feature: Arguments

  @database
  Scenario: Can create an argument in contribuable opinion
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    When I submit a "yes" argument with text "Texte de mon argument"
    Then I should see "Merci ! Votre argument a bien été enregistré."

  Scenario: Can not create an argument in non-contribuable consultation
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | strategie-technologique-de-l-etat-et-services-publics |
      | stepSlug         | collecte-des-avis-pour-une-meilleur-strategie         |
      | opinionTypeSlug  | causes                                                |
      | opinionSlug      | opinion-51                                           |
    Then I should not see "Argument yes field" on "opinionPage"
    And I should not see "Argument no field" on "opinionPage"

  @javascript @database
  Scenario: Logged in user wants to vote for an argument
    And I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    And I wait 3 seconds
    When I click the "#arg-2 .btn-success" element
    Then I should see "1" in the "#arg-2 .opinion__votes-nb" element
    And I should see "Merci ! Votre vote a bien été pris en compte."
    And I should see "Annuler mon vote"
    And I click the "#arg-2 .btn-danger" element
    And I should see "0" in the "#arg-2 .opinion__votes-nb" element

  @javascript @database
  Scenario: Author of an argument loose their votes when updating it
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    And I wait 3 seconds
    And I should see "5" in the "#arg-1 .opinion__votes-nb" element
    When I follow "Modifier"
    And I wait 3 seconds
    And I fill in the following:
      | capco_app_argument_body      | Je modifie mon argument !   |
    And I check "capco_app_argument_confirm"
    And I press "Modifier"
    Then I should see "Merci ! Votre argument a bien été modifié."
    And I should see "0" in the "#arg-1 .opinion__votes-nb" element

  Scenario: Non author of an argument wants to update it
    Given I am logged in as admin
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    Then I should not see "Modifier" in the "#arg-1" element

  Scenario: Author of an argument try to update without checking the confirm checkbox
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    When I follow "Modifier"
    And I fill in the following:
      | capco_app_argument_body      | Je modifie mon argument !   |
    And I press "Modifier"
    Then I should see "Merci de confirmer la perte de vos votes pour continuer."

  @database
  Scenario: Argument must be at least 3 chars long
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    When I submit a "yes" argument with text "X"
    Then I should see "L'argument doit faire au moins 3 caractères."

  @database
  Scenario: Argument must be at must 20000 chars long
    Given I am logged in as user
    And I visited "opinion page" with:
      | consultationSlug | croissance-innovation-disruption |
      | stepSlug         | collecte-des-avis                |
      | opinionTypeSlug  | causes                           |
      | opinionSlug      | opinion-2                        |
    When I submit a "yes" argument with text "Tu vois, ce n'est pas un simple sport car il faut se recréer... pour recréer... a better you et cette officialité peut vraiment retarder ce qui devrait devenir... Et j'ai toujours grandi parmi les chiens. Même si on se ment, je sais que, grâce à ma propre vérité en vérité, la vérité, il n'y a pas de vérité et parfois c'est bon parfois c'est pas bon. Et là, vraiment, j'essaie de tout coeur de donner la plus belle réponse de la terre ! Si je t'emmerde, tu me le dis, j'ai vraiment une grande mission car entre penser et dire, il y a un monde de différence et finalement tout refaire depuis le début. Et j'ai toujours grandi parmi les chiens. Je me souviens en fait, je ne suis pas un simple danseur car il faut toute la splendeur du aware et cette officialité peut vraiment retarder ce qui devrait devenir... Donc on n'est jamais seul spirituellement ! You see, j'ai vraiment une grande mission car entre penser et dire, il y a un monde de différence parce que spirituellement, on est tous ensemble, ok ? Et tu as envie de le dire au monde entier, including yourself. You see, je sais que, grâce à ma propre vérité on est tous capables de donner des informations à chacun car l'aboutissement de l'instinct, c'est l'amour ! Mais ça, c'est uniquement lié au spirit. Si je t'emmerde, tu me le dis, je suis mon meilleur modèle car entre penser et dire, il y a un monde de différence et c'est très, très beau d'avoir son propre moi-même ! Donc on n'est jamais seul spirituellement ! Tu comprends, je ne suis pas un simple danseur car il y a de bonnes règles, de bonnes rules car l'aboutissement de l'instinct, c'est l'amour ! Il y a un an, je t'aurais parlé de mes muscles. Ah non attention, après il faut s'intégrer tout ça dans les environnements et on est tous capables de donner des informations à chacun et parfois c'est bon parfois c'est pas bon. Donc on n'est jamais seul spirituellement ! Je me souviens en fait, je suis mon meilleur modèle car c'est un très, très gros travail et ça, c'est très dur, et, et, et... c'est très facile en même temps. Pour te dire comme on a beaucoup à apprendre sur la vie !"
    Then I should see "Les arguments sont limités à 2000 caractères. Soyez plus concis ou publiez une nouvelle proposition."
