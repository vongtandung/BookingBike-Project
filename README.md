# BookingBike-Project
**BookBike Project**
### *Project Name : ILoveXeOm
*Lê Võ Hoàng Duy 1512069*
*Vòng Tần Dũng 1512082*
# Đồ Án Giữ Kì
## Ứng Dụng Đặt Xe

## TECHNIQUES
### SOA RESTful API
### Realtime Web Application
## Google Maps API
## APP #1: REQUEST RECEIVER
### WebApp nhận thông tin khách (request): họ tên, điện thoại, địa chỉ đón khách, ghi chú
## APP #2: LOCATION IDENTIFIER
WebApp xác định toạ độ khách dựa trên thông tin do app #1 ghi nhận
Lần lượt thể hiện thông tin các request được ghi nhận bởi app #1 => nhân viên xác định 1 cách tương đối vị trí khách trên bản đồ (dựa vào địa chỉ & ghi chú)
Nhân viên sử dụng geocoding để xác định nhanh toạ độ dựa vào địa chỉ
Nhân viên có thể di chuyển vị trí khách trên bản đồ 1 cách tự do, địa chỉ khách khi đó phải được cập nhật lại tương ứng (reverse geocoding)
Lưu ý: địa chỉ gửi cho xe là địa chỉ gốc được ghi nhận bởi điện thoại viên (app #1), không phải địa chỉ có được sau khi reverse geocode

## APP #3: REQUEST MANAGEMENT
WebApp thể hiện danh sách request cùng trạng thái tương ứng (chưa được định vị, đã định vị xong, đã có xe nhận, đang di chuyển, đã hoàn thành, …)
Danh sách được sắp xếp theo thứ tự giảm dần theo thời điểm đặt
Trong trường hợp request đã có xe nhận, nhân viên có thể chọn xem đường đi ngắn nhất từ xe đến khách trên bản đồ, thông tin tài xế cũng được thể hiện đầy đủ trên danh sách
## APP #4: DRIVER
WebApp
Giao diện được thiết kế phù hợp với màn hình điện thoại
Cho phép cập nhật vị trí hiện tại thông qua hành vi click bản đồ. Nếu click xa quá 100m (theo công thức Harversine) thì thông báo lỗi
Cho phép tài xế đăng nhập vào hệ thống và sẵn sàng nhận thông tin request
Cho phép đổi trạng thái READY / STANDBY
Khi thông tin 1 request được gửi xuống, app thể hiện trong vòng 10s và yêu cầu tài xế phản hồi. Nếu tài xế TỪ CHỐI hoặc KHÔNG PHẢN HỒI, hệ thống tự động tìm xe khác cho khách.
Khi tài xế đồng ý đón khách, app show đường đi ngắn nhất từ vị trí hiện tại đến vị trí khách trên bản đồ, giúp tài xế dễ dàng đi đến ĐIỂM ĐÓN KHÁCH.
Tài xế khi đón được khách, chọn lệnh BẮT ĐẦU; và sau khi đến nơi, chọn lệnh KẾT THÚC
Sau khi request kết thúc, tài xế được chuyển về trạng thái READY để có thể nhận được request khác


