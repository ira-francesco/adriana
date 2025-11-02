const dataInizio = new Date("2025-08-30T22:04:00").getTime(); 

function aggiornaTimer() {
    const dataOggi = new Date().getTime();

    const differenza = dataOggi - dataInizio;

    const secondi = Math.floor(differenza / 1000);
    const minuti = Math.floor(secondi / 60);
    const ore = Math.floor(minuti / 60);
    const giorni = Math.floor(ore / 24);

    const h = ore % 24;
    const m = minuti % 60;
    const s = secondi % 60;

    const formattaNumero = (num) => String(num).padStart(2, '0');

    document.getElementById("days").innerHTML = giorni;
    document.getElementById("hours").innerHTML = formattaNumero(h);
    document.getElementById("minutes").innerHTML = formattaNumero(m);
    document.getElementById("seconds").innerHTML = formattaNumero(s);
}

aggiornaTimer();

setInterval(aggiornaTimer, 1000);