<template>
    <v-container>
        <v-card :style="{ width: 'fit-content' }">
            <v-card-title>WOD</v-card-title>
            <v-card-text>
                <p><strong>Date:</strong> {{ wod.date }}</p>
                <p><strong>Box Name:</strong> {{ wod.boxName }}</p>
                <p><strong>Member Name:</strong> {{ wod.memberName }}</p>
                <p><strong>Info:</strong> {{ wod.info }}</p>
                <p><strong>Time Cap:</strong> {{ wod.timeCap }}</p>
                <p><strong>Rounds:</strong> {{ wod.rounds }}</p>
                <p><strong>Created Time:</strong> {{ wod.createdTime }}</p>
            </v-card-text>
            <v-card-text v-for="(wodDet, index) in wod.wodDetResDtoList" :key="wodDet.id" class="mb-4"
                :style="{ width: 'fit-content' }">
                Exercise {{ index + 1 }}
                <p><strong>Name:</strong> {{ wodDet.name }}</p>
                <p><strong>Contents:</strong> {{ wodDet.contents }}</p>
            </v-card-text>
        </v-card>
    </v-container>
</template>


<script>
export default {
    data() {
        return {
            wod: {
                id: 6,
                boxName: "홍길동의 크로스핏",
                memberName: "권채훈",
                date: "2024-08-12",
                timeCap: "12:34:56",
                rounds: 5,
                info: "AMRAP in 12minutes",
                createdTime: "2024-08-10T13:49:31",
                wodDetResDtoList: [
                    {
                        id: 21,
                        name: "One arm DB Over Head Lunge",
                        contents: "6/6",
                    },
                    {
                        id: 22,
                        name: "Toes to bar",
                        contents: "12",
                    },
                    {
                        id: 23,
                        name: "DB snatch",
                        contents: "12",
                    },
                    {
                        id: 24,
                        name: "DB hop",
                        contents: "12",
                    }
                ]
            }
        };
    },
};
</script>
