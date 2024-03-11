import 'package:file_picker/file_picker.dart';

Future<String?> selectFile(List<String>? extensions) async {
  final FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: extensions,
      allowMultiple: false);

  if (result == null) {
    return null;
  }

  return null;
}
