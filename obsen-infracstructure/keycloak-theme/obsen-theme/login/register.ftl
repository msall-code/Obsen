<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OBSEN - Inscription</title>
    <#if properties.styles??>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
</head>
<body>
    <div class="obsen-card">
        <div class="obsen-title">OBSEN</div>
        <div class="obsen-subtitle">Créer un nouveau compte</div>

        <#if message?? && message.type = 'error'>
            <div class="alert-error">
                ${kcSanitize(message.summary)?no_esc}
            </div>
        </#if>

        <form action="${url.registrationAction}" method="post">
            <div class="form-group">
                <label for="username" class="form-label">Nom d'utilisateur</label>
                <input id="username" name="username" type="text" value="${(register.formData.username!'')}" required autofocus class="form-input" />
            </div>

            <div class="form-group">
                <label for="firstName" class="form-label">Prénom</label>
                <input id="firstName" name="firstName" type="text" value="${(register.formData.firstName!'')}" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="lastName" class="form-label">Nom</label>
                <input id="lastName" name="lastName" type="text" value="${(register.formData.lastName!'')}" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="email" class="form-label">Adresse Email</label>
                <input id="email" name="email" type="email" value="${(register.formData.email!'')}" required class="form-input" />
            </div>

            <#if passwordRequired??>
                <div class="form-group">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input id="password" name="password" type="password" required class="form-input" />
                </div>

                <div class="form-group">
                    <label for="password-confirm" class="form-label">Confirmer le mot de passe</label>
                    <input id="password-confirm" name="password-confirm" type="password" required class="form-input" />
                </div>
            </#if>

            <button type="submit" class="btn-primary">S'inscrire</button>
        </form>

        <div class="auth-footer">
            Vous avez déjà un compte ?
            <a href="${url.loginUrl}" class="auth-link">Se connecter</a>
        </div>
    </div>
</body>
</html>