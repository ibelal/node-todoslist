$(document).ready(function () {
    $(".deleted-task").on("click", function () {
        if (confirm("Are you sure you want to delete this Task?")) {
            const id = this.value
            $.ajax({
                type: "DELETE",
                url: `/deletetask/${id}`,
                success: () => {
                    window.location.reload()
                },
                error: () => {
                    alert("Error deleting task.")
                }
            })
        }
    })
})