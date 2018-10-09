//Document ready
$(function () {
    let counter = 0;
    var firstMess = true;
    $("#user").val('');

    setInterval(function () {
        $.ajax("http://172.16.15.200:3000/pull")
            .done(elemt => {
                console.log(elemt.messages);
                elemt.messages.forEach(element => {
                    getData(element.name, element.subject, element.message);
                });
            });
    }, 1000);


    $("#Invia").on('click', evento => {
        evento.preventDefault();

        $('form p').each(index => {
            $('form p').remove();
        });

        if (firstMess) {
            if (check($("#Nome").val()) && $("#Nome").val().length >= 3) {
                counter++;
            } else {
                let p = "Inserisci un nome che abbia una lunghezza maggiore di 3 caratteri";
                $("#Nome").after('<p>' + p);
            }

            if (check($("#Cognome").val()) && $("#Cognome").val().length >= 3) {
                counter++;
            } else {
                let p = "Inserisci un cognome che abbia una lunghezza maggiore di 3 caratteri";
                $("#Cognome").after('<p>' + p);
            }
            $('#user').val($("#Nome").val() + " " + $("#Cognome").val());
        } else {
            counter = counter + 2;
        }

        if (check($("#Messaggio").val()) && $("#Messaggio").val().length >= 1) {
            counter++;
        } else {
            let p = "Inserisci un messaggio che abbia una lunghezza maggiore di 1 caratteri";
            $("#Messaggio").after('<p>' + p);
        }
        console.log(counter);
        if (check($("#Oggetto").val()) && check($("#Oggetto").val().length >= 5)) {
            if (counter == 3) {
                // $("form").fadeOut();
                stamp(2);
                removeClas();
                counter = 0;
            }
        } else if (!check($("#Oggetto").val())) {
            if (counter == 3) {
                // $("form").fadeOut();
                stamp(1);
                removeClas();
                counter = 0;
            }
        } else if (check($("#Oggetto").val().length < 5)) {
            let p = "Inserisci un oggetto che abbia una lunghezza maggiore di 5 caratteri.";
            $("#Oggetto").after('<p>' + p);
        }
        if (counter > 3) {
            counter = 0;
        }
    })

    function removeClas() {
        setTimeout(() => {
            $(".hidden").removeClass("hidden");
            setTimeout(() => {
                $(".message").fadeIn();
            }, 250);
        }, 500);
    }

    function stamp(val) {
        if (counter == 3) {
            firstMess = false;
            $(".errore").html("");

            let divMessage = $('<div>');
            divMessage.addClass('message');

            let labName = $("<p>");
            if (firstMess) {
                labName.html($("#Nome").val() + " " + $("#Cognome").val());
                $("#Nome , label[for=Nome]").remove();
                $("#Cognome , label[for=Cognome]").remove();
                $("#user").val($("#Nome").val() + " " + $("#Cognome").val());
            } else {
                $("#Nome , label[for=Nome]").remove();
                $("#Cognome , label[for=Cognome]").remove();
                labName.html($("#user").val());
            }

            let labMessaggio = $("<p>");
            labMessaggio.html($("#Messaggio").val());

            divMessage.append(labName);

            if (val === 2) {
                let labOggetto = $("<p>");
                labOggetto.html($("#Oggetto").val());
                divMessage.append(labOggetto);
            } else {
                let labOggetto = $("<p>");
                labOggetto.html("");
                divMessage.append(labOggetto);
            }
            divMessage.append(labMessaggio);

            $('.allMessage').prepend(divMessage);

            divMessage.addClass('newMessage newMessage-active');

            // blink();
            let messaggio = $("#Messaggio").val();
            console.log(messaggio);
            let oggetto = $("#Oggetto").val();
            console.log(oggetto);
            let nome = $("#Nome").val() + " " + $("#Cognome").val();

            if (!!nome) {
                nome = $("#user").val();
            }
            console.log($("#user").val());
            if (oggetto == undefined) {
                oggetto = "Null";
            }

            var mystring = {
                "id": 7,
                "name": nome,
                "subject": oggetto,
                "message": messaggio
            }

            setTimeout(() => {
                divMessage.removeClass('newMessage-active');
            }, 2000);

            $.ajax({
                url: "http://172.16.15.200:3000/push",
                dataType: "json",
                data: {
                    "message": encodeURIComponent(JSON.stringify(mystring))
                },
                statusCode: {
                    200: function () {
                        console.log("Message is pushed");
                    }
                }
            });
            emptyAllCells();
        }
    }

    function getData(nome, subject, messagge) {
        let cognome = nome.split(' ');

        let divMessage = $('<div>');
        divMessage.addClass('message');

        let labName = $("<p>");
        labName.html(cognome[0] + " " + cognome[1]);

        let labMessaggio = $("<p>");
        labMessaggio.html(messagge);

        divMessage.append(labName);

        let labOggetto = $("<p>");
        labOggetto.html(subject);
        divMessage.append(labOggetto);

        emptyAllCells();
        divMessage.append(labMessaggio);

        $('.allMessage').prepend(divMessage);
    }

    function blink() {
        $('.allMessage').addClass('newMessage-active');
        setTimeout(() => {
            $('.allMessage').removeClass('newMessage-active')
        }, 2000);
    }

    function emptyAllCells() {
        $("form input:not(.button) , form textarea").each(index => {
            $("form input ,form textarea").eq(index).val('');
        })
    }

    function check(element) {
        if (!!element) {
            return true;
        } else {
            return false;
        }
    }
});