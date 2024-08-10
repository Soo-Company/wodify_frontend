<template>
    <v-container>
        <h1>Wod 등록</h1>
        <v-text-field v-model="wodSaveReqDto.date" label="Date" placeholder="yyyy-mm-dd"></v-text-field>
        <v-text-field v-model="wodSaveReqDto.timeCap" label="TimeCap" placeholder="HH:mm:ss"></v-text-field>
        <v-text-field v-model="wodSaveReqDto.rounds" label="Rounds" placeholder="number"></v-text-field>
        <v-textarea v-model="wodSaveReqDto.info" label="Info" placeholder="여기에 설명을 입력하세요..." rows="5" outlined></v-textarea>

        <div v-for="(wodDetSaveReqDto, index) in wodSaveReqDto.wodDetSaveReqDtoList" :key="index">
            <v-text-field v-model="wodDetSaveReqDto.name" :label="`Name ${index + 1}`" placeholder="Enter exercise name"></v-text-field>
            <v-text-field v-model="wodDetSaveReqDto.contents" :label="`Contents ${index + 1}`" placeholder="Enter exercise contents"></v-text-field>
        </div>

        <v-btn @click="addWodDet" color="secondary">Add WodDet</v-btn>
        <v-btn @click="submitForm" color="primary">Submit</v-btn>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
            wodSaveReqDto: {
                date: '2024-08-10',
                timeCap: '00:30:00',
                rounds: '3',
                info: 'WOD 설명 텍스트입니다.',
                wodDetSaveReqDtoList: []
            }
        };
    },
    methods: {
        addWodDet() {
            this.count ++;
            this.wodSaveReqDto.wodDetSaveReqDtoList.push({ name: `종목명${this.count}`, contents: `종목내용${this.count}` });
        },
        submitForm() {
            console.log('Form submitted successfully:', this.wodSaveReqDto);
        }
    }
};
</script>
