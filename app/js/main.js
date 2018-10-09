//Document ready
$(function () {
    const user = $('#user'),
        name = $("#Nome"),
        surname = $("#Cognome"),
        subject = $("#Oggetto"),
        message = $("#Messaggio");

    let fieldFilled = 0;
    $("#user").val('');
    setInterval(function () {
        $.ajax("http://172.16.15.200:3000/pull")
            .done(elemt => {
                console.log(elemt.messages);
                elemt.messages.forEach(element => {
                    stampData(element.name, element.subject, element.message);
                });
            });
    }, 1000);


    $("#Invia").on('click', evento => {
        evento.preventDefault();

        removeObject([$('form p')]);

        //If user hasn't a value check name and surname
        //Or if it has a value skip
        if (!user.val()) {
            if (check(name.val()) && name.val().length >= 3) {
                fieldFilled++;
            } else {
                let p = "Inserisci un nome che abbia una lunghezza maggiore di 3 caratteri";
                name.after('<p>' + p);
            }

            if (check(surname.val()) && surname.val().length >= 3) {
                fieldFilled++;
            } else {
                let p = "Inserisci un cognome che abbia una lunghezza maggiore di 3 caratteri";
                surname.after('<p>' + p);
            }
        }

        if (check(message.val()) && message.val().length >= 1) {
            fieldFilled++;
        } else {
            let p = "Inserisci un messaggio che abbia una lunghezza maggiore di 1 caratteri";
            message.after('<p>' + p);
        }

        if ((check(subject.val()) && subject.val().length >= 5) || (!check(subject.val()))) {
            //Check if all the field is filled 
            //Or is user is set check only message
            if (fieldFilled == 3 || (!!user.val() && fieldFilled == 1)) {
                if (!user.val()) {
                    user.val(name.val() + " " + surname.val());
                    removeObject([name, surname, $('label[for=Nome]'), $('label[for=Cognome]')]);
                }

                sendToSever(user.val(), subject.val(), message.val());
                stampData(user.val(), subject.val(), message.val());
            }

            fieldFilled = 0;
        } else if (subject.val().length < 5) {
            let p = "Inserisci un oggetto che abbia una lunghezza maggiore di 5 caratteri.";
            subject.after('<p>' + p);
        }
        if (fieldFilled > 3) {
            fieldFilled = 0;
        }
    })

    /**
     * @param {Array of object} object 
     */
    function removeObject(object) {
        object.forEach(index => {
            index.remove();
        })
    }

    /**
     * @param {string} nome 
     * @param {string} oggetto 
     * @param {string} messaggio 
     */
    function sendToSever(nome, oggetto, messaggio) {
        if (oggetto == undefined) {
            oggetto = " ";
        }

        var mystring = {
            "id": 7,
            "name": nome,
            "subject": oggetto,
            "message": messaggio
        }

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
    }

    function stampData(name, subject, messagge) {
        //Set div of single message
        let divMessage = $('<div>');
        divMessage.addClass('message');

        //Set p of name
        let labName = $("<p>");
        labName.html(name);

        //Set p for body of message
        let labMessaggio = $("<p>");
        labMessaggio.html(messagge);

        //Set p of subject
        let labOggetto = $("<p>");
        labOggetto.html(subject);

        //Set all in a master div
        divMessage.append(labName);
        divMessage.append(labOggetto);
        divMessage.append(labMessaggio);

        emptyAllCells();

        //Print message in allMessage div
        $('.allMessage').prepend(divMessage);
    }

    function emptyAllCells() {
        $("form input:not(.button) , form textarea").each(index => {
            $("form input ,form textarea").eq(index).val('');
        })
    }

    /**
     * 
     * @param {Object} element 
     */
    function check(element) {
        if (!!element) {
            return true;
        } else {
            return false;
        }
    }
});