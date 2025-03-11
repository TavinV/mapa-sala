
class Sala {
    static async teste(){
        console.log("Live")
    }
    static async getSala(id) {
        try {
            const response = await fetch(`${SALAS_URL}/${id}`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar sala:", error);
            return null;
        }
    }

    static async getSalas() {
        try {
            const response = await fetch(`${SALAS_URL}`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
            return null;
        }
    }

    static async atualizarSala(id, novosDados) {
        try {
            await fetch(`${SALAS_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novosDados),
            });
            console.log(`Sala ${id} atualizada com sucesso!`);
        } catch (error) {
            console.error("Erro ao atualizar sala:", error);
        }
    }

    static async adicionarHorario(idSala, dia, inicio, qtdAulas, idTurma) {
        console.log("horarios na sala")
        const sala = await this.getSala(idSala);
        console.log(qtdAulas)
        if (!sala) return;

        if (!sala.horarios[dia]) sala.horarios[dia] = [];

        let [hora, minuto] = inicio.split(':').map(Number);
        for (let i = 0; i < qtdAulas; i++) {
            console.log("adicionando aula " + i)

            let fimMinuto = minuto + 45;
            let fimHora = hora + Math.floor(fimMinuto / 60);
            fimMinuto %= 60;

            sala.horarios[dia].push({
                inicio: `${hora}:${minuto.toString().padStart(2, '0')}`,
                fim: `${fimHora}:${fimMinuto.toString().padStart(2, '0')}`,
                turma: idTurma
            });

            hora = fimHora;
            minuto = fimMinuto;

            console.log(sala.horarios[dia])
        }

        console.log(sala.horarios[dia] )
        console.log("adicionar horario Sala")
        await this.atualizarSala(idSala, sala);
    }


    static async excluirHorario(idSala, dia, turma) {
        console.log("Excluir")
        const sala = await this.getSala(idSala);
        console.log(sala)

        if (!sala || !sala.horarios[dia]) {
            console.log("NÃO ACHEI A SALA");
            return;
        }

        // Remove o horário desejado
        sala.horarios[dia] = sala.horarios[dia].filter(h => h.turma != turma.id);
        console.log(sala.horarios[dia])
        // Se o dia ficar sem horários, mantemos o array vazio em vez de deletar a chave
        if (sala.horarios[dia].length === 0) {
            sala.horarios[dia] = [];
        }

        await this.atualizarSala(idSala, sala);
    }
}

Sala.excluirHorario("lab-1-piso-b-2025", "segunda-feira", "I1PB")