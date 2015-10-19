
export default {
    locales: ['fr-FR'],
    messages: {
        comment: {
            list: '{num, plural, =0{0 commentaire} one{# commentaire} other{# commentaires}}',
            vote: {
                submit: 'D\'accord',
                remove: 'Annuler mon vote',
            },
            report: {
                submit: 'Signaler',
                reported: 'Signalé',
            },
            update: {
                button: 'Modifier',
            },
            trashed: {
                label: 'Dans la corbeille',
            },
            constraints: {
                author_email: 'Cette valeur n\'est pas une adresse email valide.',
                author_name: 'Votre nom doit faire au moins 2 caractères',
                body: 'Votre commentaire doit faire au moins 2 caractères',
            },
            write: 'Ecrire un commentaire...',
            edited: 'édité le',
            submit_success: 'Merci ! Votre commentaire a bien été ajouté.',
            submit_error: 'Désolé, un problème est survenu lors de l\'ajout de votre commentaire.',
            more: 'Voir plus de commentaires',
            submit: 'Commenter',
            public_name: 'Votre nom sera rendu public sur la plateforme.',
            email_info: 'Pour valider que vous n\'êtes pas un robot.',
            publish: 'Publier un commentaire',
            why_create_account: 'Pourquoi créer un compte ?',
            create_account_reason_1: 'valider que vous n\'êtes pas un robot une bonne fois pour toutes',
            create_account_reason_2: 'modifier/supprimer vos commentaires',
            create_account_reason_3: 'lier vos commentaires à votre profil',
            with_my_account: 'Commenter avec mon compte',
            without_account: 'Commenter sans créer de compte',
        },
        source: {
            add: 'Créer une source',
            link: 'Lien *',
            title: 'Titre *',
            body: 'Description *',
            type: 'Type *',
            infos: 'Merci d\'examiner les sources existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
            constraints: {
                body: 'Le contenu de la source doit faire au moins 2 caractères.',
                title: 'Le titre de la source doit faire au moins 2 caractères.',
                category: 'Veuillez choisir un type pour soumettre une source',
                link: 'Cette valeur n\'est pas une URL valide.',
            },
        },
        argument: {
            yes: {
                add: 'Ajouter un argument pour',
                list: '{num, plural, =0{0 argument pour} one{# argument pour} other{# arguments pour}}',
            },
            no: {
                add: 'Ajouter un argument contre',
                list: '{num, plural, =0{0 argument contre} one{# argument contre} other{# arguments contre}}',
            },
            simple: {
                add: 'Déposer un avis',
                list: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
            },
            constraints: {
                min: 'Le contenu doit faire au moins 3 caractères.',
                max: 'Les avis sont limités à 2000 caractères. Soyez plus concis ou publiez une nouvelle proposition.',
            },
            filter: {
                yes: 'Trier les arguments pour',
                no: 'Trier les arguments contre',
                simple: 'Trier les avis',
            },
        },
        opinion: {
            appendices: {
              hide: 'Masquer {title}.',
              show: 'Afficher {title}',
            },
            constraints: {
                body: 'Le contenu de la proposition doit faire au moins 2 caractères.',
                title: 'Le titre de la proposition doit faire au moins 2 caractères.',
            },
            link: {
                type: 'Type de proposition*',
                help: {
                    type: 'Quel est le type de votre proposition ?',
                    title: 'Quel est l\'objet de votre proposition ?',
                    body: 'Rédigez votre proposition',
                },
                constraints: {
                    type: 'Veuillez choisir un type pour soumettre une proposition liée.',
                },
                infos: 'Merci d\'examiner les propositions existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
                info: 'Votre proposition sera liée à :',
                opinion: 'Proposition liée :',
            },
            add_new_link: 'Ajouter une proposition liée',
            title: 'Titre*',
            title_help: 'Quel est l\'objet de votre proposition ?',
            body_help: 'Rédigez votre proposition',
            body: 'Proposition*',
            type: 'Type de proposition*',
            type_help: 'Quel est le type de votre proposition ?',
            request: {
              failure: 'Une erreur est survenue, veuillez réessayer.',
              create_vote: {
                  success: 'Merci ! Votre vote a bien été pris en compte.',
              },
              delete_vote: {
                success: 'Votre vote a bien été supprimé.',
              },
            },
            header: {
                opinion: 'Proposition',
                article: 'Article',
                version: 'Modification',
            },
            ranking: {
                versions: 'Top {max} des modifications',
                opinions: 'Top {max} des propositions',
                articles: 'Top {max} des articles',
            },
            progress_done: '{num, plural, =0{0 vote favorable} one{# vote favorable} other{# votes favorables}}.',
            progress_left: '{left, plural, =0{0 nécessaire} one{# nécessaire} other{# nécessaires}} pour atteindre {max}.',
            progress_reached: 'Cette proposition a atteint le seuil avec {with, plural, =0{0 vote} one{# vote} other{# votes}}.',
            no_new_version: 'Aucune modification proposée',
            no_new_source: 'Aucune source proposée',
            no_new_link: 'Aucune proposition liée',
            add_new_version: 'Proposer une modification',
            add_new_source: 'Proposer une source',
            add_new_version_infos: 'Merci d\'examiner les modifications existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
            version_comment: 'Explication',
            version_parent: 'Modification de : ',
            version: {
                title: 'Titre *',
                body: 'Modification *',
                body_helper: 'Modifiez le texte',
                confirm: 'En modifiant ma contribution, je comprends que tous les votes qui lui sont associés seront réinitialisés.',
                comment: 'Explication',
                comment_helper: 'Expliquez pourquoi vous souhaitez apporter ces modifications',
                title_error: 'Le titre doit contenir au moins 2 caractères.',
                confirm_error: 'Vous devez confirmer la perte de vos votes pour continuer.',
                body_error: 'Vous devez modifier le contenu de la proposition d\'origine pour pouvoir proposer une modification.',
                filter: 'Trier les modifications',
            },
            diff: {
                tooltip: 'Voir les modifications',
                title: 'Modification(s) proposée(s)',
                infos: 'Les ajouts en vert et les suppressions en rouge',
            },
        },
        vote: {
            date: 'Date',
            votes: 'Votes',
            ok: 'D\'accord',
            mitige: 'Mitigé',
            nok: 'Pas d\'accord',
            cancel: 'Annuler mon vote',
            form: 'Formulaire de vote',
            popover: {
                title: 'Connectez-vous pour contribuer',
                body: 'Vous devez être connecté pour réaliser cette action.',
                login: 'Connexion',
                signin: 'Inscription',
            },
            aria_label: {
                ok: 'Souhaitez-vous déclarer être d\'accord avec cette proposition ?',
                mitige: 'Souhaitez-vous déclarer être mitigé sur cette proposition ?',
                nok: 'Souhaitez-vous déclarer ne pas être d\'accord avec cette proposition ?',
            },
            aria_label_active: {
                ok: 'Vous avez déclaré être d\'accord avec cette proposition',
                mitige: 'Vous avez déclaré être mitigé sur cette proposition',
                nok: 'Vous avez déclaré n\'être pas d\'accord avec cette proposition',
            },
        },
        share: {
            facebook: 'Facebook',
            twitter: 'Twitter',
            googleplus: 'Google+',
            mail: 'Email',
            link: 'Lien de partage',
        },
        global: {
            report: {
                submit: 'Signaler',
                reported: 'Signalé',
            },
            votes: '{num, plural, =0{0 vote} one{# vote} other{# votes}}',
            versions: '{num, plural, =0{0 modification} one{# modification} other{# modifications}}',
            sources: '{num, plural, =0{0 source} one{# source} other{# sources}}',
            simple_arguments: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
            arguments: '{num, plural, =0{0 argument} one{# argument} other{# arguments}}',
            votes_evolution: 'évolution des votes',
            links: '{num, plural, =0{0 proposition liée} one{# proposition liée} other{# propositions liées}}',
            back: 'Retour',
            close: 'Fermer',
            content: 'Contenu',
            share: 'Partager',
            select: 'Choisir une valeur',
            more: 'Voir plus',
            publish: 'Publier',
            edited: 'édité le',
            edit: 'Modifier',
            link: 'Lien',
            cancel: 'Annuler',
            title: 'Titre',
            answer: 'Répondre',
            loading: 'Chargement...',
            login: 'Connexion',
            comment: 'Commentaire',
            name: 'Nom ',
            fullname: 'Nom complet *',
            hidden_email: 'Adresse électronique (cachée) *',
            filter_popular: 'Les plus populaires',
            filter_votes: 'Les plus votés',
            filter_favorable: 'Les plus favorables',
            filter_last: 'Les plus récents',
            filter_old: 'Les plus anciens',
            filter_comments: 'Les plus commentés',
            all_required: 'Tous les champs sont obligatoires.',
            read_more: 'Afficher la suite',
        },
    },
};
