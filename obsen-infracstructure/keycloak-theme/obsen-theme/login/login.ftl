<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OBSEN - Authentification</title>
    <!-- Chargement automatique des fichiers déclarés dans theme.properties -->
    <#if properties.styles??>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
</head>
<body>
    <div class="obsen-card">
        <div class="obsen-title">OBSEN</div>
        <div class="obsen-subtitle">Plateforme d'Observabilité & SRE</div>

        <#if message?? && message.type = 'error'>
            <div class="alert-error">
                ${kcSanitize(message.summary)?no_esc}
            </div>
        </#if>

        <form action="${url.loginAction}" method="post">
            <div class="form-group">
                <label for="username" class="form-label">Identifiant ou Email</label>
                <input id="username" name="username" type="text" value="${(login.username!'')}" required autofocus autocomplete="username" placeholder="Entrez votre nom d'utilisateur" class="form-input" />
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Mot de passe</label>
                <input id="password" name="password" type="password" required class="form-input" />
            </div>

            <button type="submit" class="btn-primary">Se connecter</button>
        </form>

        <#if realm.password && realm.registrationAllowed?? && realm.registrationAllowed>
            <div class="auth-footer">
                Pas encore de compte ? 
                <a href="${url.registrationUrl}" class="auth-link">Créer un compte</a>
            </div>
        </#if>
    </div>
</body>
</html>