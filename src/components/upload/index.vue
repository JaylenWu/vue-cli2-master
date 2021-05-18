<template>
    <div>
        <input type="file" name="" id="" @change="onChange" />
    </div>
</template>
<script>
export default {
    name: "jw-upload",
    methods: {
        onChange(e) {
            console.log(e);
            const file = e.target.files[0];
            console.log(file);
        }
    }
}
</script>
<style>

</style>