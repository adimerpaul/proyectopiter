$(document).ready(function () {
    getScores();
    function getScores() {
        const url= 'http://127.0.0.1:3000/highscores';
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                const scoreTable = $('#scoreTable');
                scoreTable.empty();
                response.forEach((score, index) => {
                    scoreTable.append(`<tr>
                <td>${index + 1}</td>
                <td>${score.username}</td>
                <td>${score.score}</td>
                </tr>`);
                });
            },
            error: function () {
                $('#message').text('Ocurrió un error al cargar las puntuaciones.');
            }
        });
    }

    $('#usernameForm').on('submit', function (event) {
        event.preventDefault(); // Prevenir la acción por defecto del formulario

        const username = $('#username').val(); // Obtener el valor del campo username

        const url= 'http://127.0.0.1:3000/username';
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json', // Tipo de contenido enviado
            data: JSON.stringify({ username: username }), // Datos enviados al servidor
            success: function (response) {
                // Si la respuesta es exitosa, redirigir a la página del juego
                window.location.href = `gameplay.html?username=${encodeURIComponent(username)}`;
            },
            error: function (xhr) {
                // Manejar errores según el estado de la respuesta
                if (xhr.status === 409) {
                    $('#message').text('El nombre de usuario ya existe.');
                } else if (xhr.status === 400) {
                    $('#message').text('Se requiere un nombre de usuario.');
                } else {
                    $('#message').text('Ocurrió un error. Inténtalo de nuevo.');
                }
            }
        });
    });
});