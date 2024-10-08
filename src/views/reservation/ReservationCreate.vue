<template>
    <div class="page-container">
        <div class="box right-align">
            <br>
            <span class="boxLocation">
                {{ this.boxName }}
            </span>
            <br>
        </div>

        <v-container>
            <br>
            <v-row class="reservationHead" justify="center">
                <v-col cols="5" class="d-flex justify-center align-center">
                    DATE
                </v-col>
                <v-col cols="5" class="d-flex justify-center align-center">
                    WOD
                </v-col>
            </v-row>
            <v-form @submit.prevent="reservation">
                <v-row class="d-flex justify-center">
                    <v-col cols="5" class="d-flex justify-center align-center">
                        <div class="date-picker-container">
                            <v-date-picker v-model="selectedDate" @update:model-value="onDateSelected"
                                style="width: 400px;" class="custom-date-picker">
                                <template v-slot:header></template>
                            </v-date-picker>
                        </div>
                    </v-col>
                    <v-col cols="5" class="justify-center align-center">
                        <div v-if="wod && wod.wodDetResDtoList.length > 0" class="bordered wod">
                            <div class="flex-between padded">
                                <span>date</span>
                                <span>{{ wod.date }}</span>
                            </div>
                            <div class="flex-between padded">
                                <span>timeCap</span>
                                <span>{{ wod.timeCap }}</span>
                            </div>
                            <div class="flex-between padded">
                                <span>rounds</span>
                                <span>{{ wod.rounds }}</span>
                            </div>
                            <div class="wod-info-container">{{ wod.info }}</div>
                            <v-table>
                                <tbody style="background-color: #D9D9D9;">
                                    <tr v-for="detail in wod.wodDetResDtoList" :key="detail.id">
                                        <td>{{ detail.name }}</td>
                                        <td>{{ detail.contents }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>

                        <div v-else class="d-flex wod" style="margin-left: 185px;">
                            <v-btn :to="{ path: '/wod/select-date' }" class="freesentation">
                                wod 생성
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

                <v-row v-for="(entry, index) in entries" :key="index" justify="center">
                    <v-col cols="5">
                        <v-text-field label="Time" type="time" v-model="entry.time" placeholder="시간을 입력해주세요"
                            class="time-field" style="margin-left:40px;
                        margin-right:40px;" required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="People" v-model="entry.people" placeholder="인원을 입력해주세요"
                            class="people-field" required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="2" class="d-flex align-center" style="margin-bottom: 16px;">
                        <v-btn @click="removeEntry(index)" icon style="margin-right: 5px;">
                            <span style="font-size: 30px;">-</span>
                        </v-btn>
                        <v-btn @click="addEntry" icon>
                            <span style="font-size: 30px;">+</span>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row class="d-flex" justify="center">
                    <RoundedButtonComponent text="Book Create" buttonType="submit" class="mx-2" />
                </v-row>

            </v-form>

            <AlertModalComponent v-model="alertModal" @update:dialog="alertModal = $event" :dialogTitle="dialogTitle"
                :dialogText="dialogText" />
        </v-container>
    </div>
</template>

<script>
import RoundedButtonComponent from '@/components/RoundedButtonComponent.vue';
import AlertModalComponent from '@/components/AlertModalComponent.vue';
import axios from 'axios';

export default {
    components: {
        RoundedButtonComponent,
        AlertModalComponent
    },
    async created() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/box/name/`);
            this.boxName = response.data.result;
        } catch (error) {
            let errorMessage = "";
            if (error.response && error.response.data) {
                // 서버에서 반환한 에러 메시지가 있는 경우
                errorMessage += `: ${error.response.data.error_message}`;
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
            this.dialogTitle = "박스명 로드 실패";
            this.dialogText = errorMessage;
            this.alertModal = true;
        }
    },
    data() {
        return {
            selectedDate: new Date(),
            formattedDate: "",
            date: "",
            wod: "",
            error: false,
            entries: [
                { time: "", people: "" }
            ],
            alertModal: false,
            dialogTitle: "",
            dialogText: "",
            boxName: "",
        };
    },
    watch: {
        date(newDate) {
            if (newDate) {
                this.fetchWod(newDate);
            }
        },
        selectedDate(selectDate) {
            if (selectDate) {
                this.formattedDate = this.formatDate(selectDate);
                this.fetchWod(this.formattedDate);
            }
        }
    },
    methods: {
        formatDate(date) {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },
        async fetchWod(date) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/wod/find/${date}`);
                this.wod = response.data.result;
                if (!this.wod) {
                    throw new Error("No data found");
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    this.error = true; // 에러 상태를 true로 설정하여 WodSave 컴포넌트를 표시합니다.
                    this.wod = "";
                } else {
                    this.errorMessage = 'WOD 데이터를 불러오는 중 오류가 발생했습니다.';
                    console.error('Error fetching WOD data:', error);
                }
            }
        },
        addEntry() {
            this.entries.push({ time: "", people: "" });
        },
        removeEntry(index) {
            this.entries.splice(index, 1);
        },
        hasDuplicateTimes() {
            const times = this.entries.map(entry => entry.time);
            const uniqueTimes = new Set(times);
            return times.length !== uniqueTimes.size;
        },
        checkpeople() {
            // entries 배열에서 people 값이 0인 항목이 있는지 확인
            const isValid = this.entries.every(entry => entry.people > 0);

            // people 값 중 하나라도 0이 있으면 false를 반환
            return isValid;
        },
        async reservation() {
            if (!this.formattedDate) {
                this.dialogTitle = "입력사항을 모두 입력해주세요";
                this.dialogText = "입력사항을 모두 입력해주세요";
                this.alertModal = true;
                return;
            }

            if (this.hasDuplicateTimes()) {
                this.dialogTitle = "중복된 시간이 있습니다";
                this.dialogText = "동일한 시간에 두 개 이상의 예약을 할 수 없습니다. 시간을 다시 선택해 주세요.";
                this.alertModal = true;
                return;
            }

            if (!this.checkpeople()) {
                this.dialogTitle = "입력사항을 모두 입력해주세요";
                this.dialogText = "인원을 작성해주세요";
                this.alertModal = true;
                return;
            }

            const reservationData = this.entries.map(entry => ({
                date: this.formattedDate,
                wodId: this.wod.id,
                time: entry.time,
                maximumPeople: entry.people
            }));

            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation/create`, reservationData)
                .then(response => {
                    console.log(response);
                    this.dialogTitle = "예약이 생성을 완료했습니다.";
                    this.dialogText = "";
                    this.alertModal = true;
                    this.$watch(
                        () => this.alertModal,
                        (newVal) => {
                            if (!newVal) {
                                window.location.href="/reservation/list";
                            }
                        }
                    );
                }).catch(error => {
                    let errorMessage = "";
                    if (error.response && error.response.data) {
                        // 서버에서 반환한 에러 메시지가 있는 경우
                        errorMessage += `: ${error.response.data.error_message}`;
                    } else if (error.message) {
                        errorMessage += `: ${error.message}`;
                    }
                    this.dialogTitle = "예약 실패";
                    this.dialogText = errorMessage;
                    this.alertModal = true;
                });
        },
    }
}
</script>

<style scoped>
.box {
    background-color: #797876;
}

.right-align {
    text-align: right;
}

.boxLocation {
    color: white;
    font-weight: 1000;
    font-size: 70px;
    font-family: "Oswald", sans-serif;
}

.page-container {
    /* 전체 페이지의 배경색을 설정합니다 */
    background-color: #D9D9D9;
    /* 원하는 배경색으로 변경 */
    min-height: 100vh;
    /* 전체 화면 높이로 설정 */
}

.reservationHead {
    font-weight: bold;
    font-size: 20px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    /* Aligns items at the two ends of the line */
}

.padded {
    padding: 0 10px;
    /* Adds padding to the left and right sides */
}

.flex-between span:first-child {
    text-align: left;
    margin-right: 10px;
    /* Adds space between the label and the value */
}

.flex-between span:last-child {
    text-align: right;
    margin-left: 10px;
    /* Adds space between the value and the label */
}

.bordered {
    border: 1px solid #ccc;
    /* 테두리 스타일 */
    padding: 10px;
    /* 여백 추가 */
}

.wod-info-container {
    margin: 10px;
    text-align: center;
    padding: 10px;
    border-radius: 40px;
    background-color: #f8f8f8;
}

.custom-date-picker {
    background-color: rgba(255, 255, 255, 0.5);
    margin-top: 20px;
}

.wod {
    margin-top: 20px;
    border-radius: 5px;
}
</style>
